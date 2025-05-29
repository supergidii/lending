from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from decimal import Decimal
import uuid
from datetime import timedelta

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True)
    referral_code = models.CharField(max_length=20, unique=True, blank=True)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='referrals')
    referral_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True, null=True)
    banned_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username', 'email']

    def save(self, *args, **kwargs):
        if not self.referral_code:
            # Generate a unique referral code
            self.referral_code = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class Investment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('matured', 'Matured'),
        ('paired', 'Paired'),
        ('partially_paid', 'Partially Paid'),
        ('completed', 'Completed'),
        ('confirmed', 'Confirmed')  # New status for countdown period
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    remn_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    maturity_date = models.DateTimeField(help_text='Date when investment matures')
    maturity_period = models.IntegerField(help_text='Duration in days until investment matures', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paired_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='paired_investments')
    return_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    referral_bonus_used = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_confirmed_at = models.DateTimeField(null=True, blank=True)
    last_payment_at = models.DateTimeField(null=True, blank=True)
    start_countdown_at = models.DateTimeField(null=True, blank=True)
    transaction_reference = models.CharField(max_length=50, unique=True, null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    payment_notes = models.TextField(blank=True)
    maturity_notification_sent = models.BooleanField(default=False)
    is_confirmed = models.BooleanField(default=False)
    pairing_reference = models.CharField(max_length=50, unique=True, null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    mature_at = models.DateTimeField(null=True, blank=True)
    countdown_duration = models.IntegerField(default=5, help_text='Duration in days until investment matures after confirmation')

    class Meta:
        indexes = [
            models.Index(fields=['status', 'is_confirmed', 'mature_at']),
            models.Index(fields=['confirmed_at']),
        ]

    def __str__(self):
        return f"Investment: {self.user.username} - ${self.amount} ({self.status})"

    def start_countdown(self):
        """Start the countdown timer when investment is fully confirmed"""
        if not self.confirmed_at:
            self.confirmed_at = timezone.now()
        # Use maturity_period if available, otherwise fallback to countdown_duration
        duration = self.maturity_period if self.maturity_period is not None else self.countdown_duration
        self.mature_at = self.confirmed_at + timedelta(days=duration)
        self.status = 'confirmed'
        self.is_confirmed = True
        self.start_countdown_at = timezone.now()
        self.save()

    def check_maturity(self):
        """Check if the investment has reached maturity"""
        if (self.is_confirmed and 
            self.status == 'confirmed' and 
            self.mature_at and 
            timezone.now() >= self.mature_at):
            self.status = 'matured'
            self.matured_at = timezone.now()  # Set the matured_at field when investment matures
            self.save()
            return True
        return False

    def calculate_return_amount(self):
        """Calculate return amount including 2% daily interest"""
        daily_interest = Decimal('0.02')  # 2% daily interest
        days_to_maturity = (self.maturity_date - self.created_at).days
        interest_amount = self.amount * daily_interest * days_to_maturity
        total_return = self.amount + interest_amount + self.referral_bonus_used
        return total_return

    def update_payment(self, amount_paid, payment_method=None, notes=None):
        """Update payment status and amounts"""
        self.amount_paid += amount_paid
        self.last_payment_at = timezone.now()
        
        if payment_method:
            self.payment_method = payment_method
        if notes:
            self.payment_notes = notes
            
        if self.amount_paid >= self.return_amount:
            self.status = 'completed'
            self.payment_confirmed_at = timezone.now()
        elif self.amount_paid > 0:
            self.status = 'partially_paid'
        
        if not self.transaction_reference:
            self.transaction_reference = f"INV-{uuid.uuid4().hex[:8].upper()}"
            
        self.save()

    def save(self, *args, **kwargs):
        if not self.pairing_reference:
            self.pairing_reference = f"PAIR-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def check_confirmation_status(self):
        """Check if all paired investments are confirmed and update status accordingly"""
        # Get all paired investments for this investment
        paired_investments = PairedInvestment.objects.filter(
            new_investor=self.user,
            pairing_reference=self.pairing_reference
        )
        
        # Check if all paired investments are confirmed
        all_confirmed = paired_investments.exists() and all(
            pi.status == 'confirmed' for pi in paired_investments
        )
        
        if all_confirmed and not self.is_confirmed:
            self.is_confirmed = True
            self.start_countdown()  # Start the countdown when fully confirmed

class Pairing(models.Model):
    matured_investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='matured_pairings')
    new_investment_id = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='new_pairings')
    amount_paired = models.DecimalField(max_digits=10, decimal_places=2)
    is_confirmed = models.BooleanField(default=False)
    paired_at = models.DateTimeField(auto_now_add=True)
    payment_due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('paired', 'Paired'),
        
    ], default='paired')
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ], default='pending')

    def __str__(self):
        return f"Pairing: {self.matured_investment.user.username} -> {self.new_investment_id.user.username}"

    def save(self, *args, **kwargs):
        if not self.payment_due_date and self.paired_at:
            # Set payment due date to 24 hours after pairing
            self.payment_due_date = self.paired_at + timedelta(hours=24)
        super().save(*args, **kwargs)

class Referral(models.Model):
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referrals_created')
    referral_code = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Referral Code: {self.referral_code} by {self.referrer.username}"

class ReferralHistory(models.Model):
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referral_history')
    referred = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referred_by_history')
    amount_invested = models.DecimalField(max_digits=10, decimal_places=2)
    bonus_earned = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('used', 'Used')])
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    used_at = models.DateTimeField(null=True, blank=True)
    payment_confirmed = models.BooleanField(default=False)
    payment_confirmed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.referrer.username} -> {self.referred.username}: ${self.bonus_earned}"

class PairedInvestment(models.Model):
    matured_investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matured_pairings')
    new_investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='new_pairings')
    amount_paired = models.DecimalField(max_digits=10, decimal_places=2)
    is_confirmed = models.BooleanField(default=False)
    paired_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('completed', 'Completed')], default='pending')
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ], default='pending')
    pairing_reference = models.CharField(max_length=50, null=True, blank=True)
     
    def __str__(self):
        return f"Paired Investment: {self.matured_investor.username} -> {self.new_investor.username}"
    
    def confirm(self):
        """Confirm the payment and check if this is the last confirmation needed"""
        self.status = 'confirmed'
        self.confirmed_at = timezone.now()
        self.save()
        
        # Get all paired investments with the same reference
        paired_investments = PairedInvestment.objects.filter(
            pairing_reference=self.pairing_reference
        )
        
        # Check if all paired investments are now confirmed
        all_confirmed = all(pi.status == 'confirmed' for pi in paired_investments)
        
        if all_confirmed:
            # Get the related investment
            investment = Investment.objects.filter(
                pairing_reference=self.pairing_reference
            ).first()
            
            if investment and not investment.is_confirmed:
                investment.is_confirmed = True
                investment.save()
    
    def save(self, *args, **kwargs):
        if not self.paired_at:
            self.paired_at = timezone.now()
        super().save(*args, **kwargs)

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected')
    ]
    
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_made')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_received')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    def __str__(self):
        return f"Payment: {self.from_user.username} -> {self.to_user.username} - ${self.amount}"
    
    def confirm(self):
        """Confirm the payment"""
        self.status = 'confirmed'
        self.confirmed_at = timezone.now()
        self.save()
    
    def reject(self, reason=''):
        """Reject the payment with a reason"""
        self.status = 'rejected'
        self.rejected_at = timezone.now()
        self.rejection_reason = reason
        self.save()
