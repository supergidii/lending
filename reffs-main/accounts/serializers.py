from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import ReferralHistory, Investment, User, PairedInvestment, WithdrawHistory
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta
from django.db import models
from django.db.models import Sum

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'password', 'referral_code', 'country')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'country': {'required': True}
        }

    def create(self, validated_data):
        referral_code = validated_data.pop('referral_code', None)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        
        if referral_code:
            try:
                referred_by = User.objects.get(referral_code=referral_code)
                user.referred_by = referred_by
            except User.DoesNotExist:
                pass
        
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        phone_number = data.get('phone_number')
        password = data.get('password')

        if not phone_number or not password:
            raise serializers.ValidationError('Both phone number and password are required.')

        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'referral_code', 'referral_earnings', 'is_staff', 'is_superuser')
        read_only_fields = ('referral_code', 'referral_earnings', 'is_staff', 'is_superuser')

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number']

class InvestmentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    return_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    referral_bonus_used = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    available_referral_bonus = serializers.SerializerMethodField()
    maturity_period = serializers.IntegerField(write_only=True)

    class Meta:
        model = Investment
        fields = ['id', 'user', 'amount', 'maturity_period', 'maturity_date', 'return_amount', 
                 'referral_bonus_used', 'available_referral_bonus', 'status', 'created_at', 
                 'mature_at', 'remaining_amount','is_confirmed', 'confirmed_at', 'remn_amount', 'pairing_reference']
        read_only_fields = ['maturity_date', 'mature_at', 'return_amount', 'status', 'is_confirmed', 
                           'created_at', 'confirmed_at', 'remaining_amount','remn_amount', 'pairing_reference']

    def validate_amount(self, value):
        if value < Decimal('100.00'):
            raise serializers.ValidationError("Minimum loan bid amount is 100")
        if value > Decimal('30000.00'):
            raise serializers.ValidationError("Maximum loan bid amount is 30,000")
        return value

    def validate_maturity_period(self, value):
        if value not in [5, 10, 20,30,60]:
            raise serializers.ValidationError("Maturity period must be 5, 10, 20, 30, or 60 days")
        return value

    def get_available_referral_bonus(self, obj):
        if obj.user:
            # Get all active referral bonuses for the user
            active_bonuses = ReferralHistory.objects.filter(
                referrer=obj.user,
                status='active',
                payment_confirmed=True
            ).aggregate(total=Sum('bonus_earned'))['total'] or Decimal('0.00')
            return active_bonuses
        return Decimal('0.00')

    @transaction.atomic
    def create(self, validated_data):
        user = self.context['request'].user
        amount = validated_data['amount']
        maturity_period = validated_data['maturity_period']
        
        # Calculate maturity date
        maturity_date = timezone.now() + timedelta(days=maturity_period)
        
        # Calculate daily interest rate (2%)
        daily_interest_rate = Decimal('0.02')
        
        # Calculate interest amount
        interest_amount = amount * daily_interest_rate * maturity_period
        
        # Get available referral bonus
        available_bonus = self.get_available_referral_bonus(Investment(user=user))
        
        # Calculate total return including referral bonus
        total_return = amount + interest_amount + available_bonus
        
        # Create the investment
        investment = Investment.objects.create(
            user=user,
            amount=amount,
            remn_amount=amount,
            maturity_period=maturity_period,
            maturity_date=maturity_date,
            return_amount=total_return,
            remaining_amount=total_return,
            referral_bonus_used=available_bonus,  # Store the used bonus amount
            status='pending'
        )
        
        # Handle referral bonus for the referrer
        if user.referred_by:
            # Calculate referral bonus (3% of investment amount)
            bonus_amount = amount * Decimal('0.03')
            
            # Create new referral history entry for this investment
            ReferralHistory.objects.create(
                referrer=user.referred_by,
                referred=user,
                amount_invested=amount,
                bonus_earned=bonus_amount,
                status='pending'
            )
            
            # Update referrer's total earnings
            user.referred_by.referral_earnings += bonus_amount
            user.referred_by.save()
        
        # If there's a referral bonus to use, update the referral history
        if available_bonus > 0:
            # Update all active referral histories to mark bonus as used
            ReferralHistory.objects.filter(
                referrer=user,
                status='active',
                payment_confirmed=True
            ).update(
                status='used',
                used_at=timezone.now()
            )
            
            # Update user's referral earnings
            user.referral_earnings -= available_bonus
            user.save()
        
        return investment

class ReferralHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralHistory
        fields = ('id', 'referrer', 'referred', 'amount_invested', 'bonus_earned', 'status', 'used_at')
        read_only_fields = ('referrer', 'referred', 'amount_invested', 'bonus_earned', 'status', 'used_at')

class PairedInvestmentSerializer(serializers.ModelSerializer):
    matured_investor_username = serializers.CharField(source='matured_investor.username', read_only=True)
    matured_investor_phone = serializers.CharField(source='matured_investor.phone_number', read_only=True)
    new_investor_username = serializers.CharField(source='new_investor.username', read_only=True)
    new_investor_phone = serializers.CharField(source='new_investor.phone_number', read_only=True)
    
    class Meta:
        model = PairedInvestment
        fields = [
            'id',
            'matured_investor',
            'new_investor',
            'matured_investor_username',
            'matured_investor_phone',
            'new_investor_username',
            'new_investor_phone',
            'amount_paired',
            'status',
            'payment_status',
            'paired_at',
            'pairing_reference'
        ]
        read_only_fields = ['matured_investor', 'new_investor', 'paired_at', 'pairing_reference']

    def validate(self, data):
        """
        Validate that the payment can be confirmed
        """
        if 'payment_status' in data and data['payment_status'] == 'paid':
            # Check if the investment is already paid
            if self.instance and self.instance.payment_status == 'paid':
                raise serializers.ValidationError("This payment has already been confirmed")
            
            # Check if the user is the matured investor
            request = self.context.get('request')
            if request and request.user != self.instance.matured_investor:
                raise serializers.ValidationError("Only the matured investor can confirm the payment")
        
        return data

    def update(self, instance, validated_data):
        """
        Update the payment status and related fields
        """
        if 'payment_status' in validated_data and validated_data['payment_status'] == 'paid':
            instance.status = 'confirmed'
            instance.payment_status = 'paid'
            instance.save()
            
            # Update the related investment status
            investment = Investment.objects.filter(
                user=instance.new_investor,
                status='paired',
                pairing_reference=instance.pairing_reference
            ).first()
            
            if investment:
                investment.status = 'completed'
                investment.payment_confirmed_at = timezone.now()
                investment.save()
        
        return instance 

class WithdrawHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for WithdrawHistory model
    """
    user = UserSerializer(read_only=True)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = WithdrawHistory
        fields = [
            'id',
            'user',
            'amount',
            'status',
            'status_display',
            'created_at',
            'processed_at'
        ]
        read_only_fields = ['user', 'created_at', 'processed_at']

    def get_status_display(self, obj):
        return obj.get_status_display()

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Withdrawal amount must be greater than zero")
        return value 