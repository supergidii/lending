from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import ReferralHistory, Investment, User, PairedInvestment
from django.utils import timezone
from decimal import Decimal
from datetime import timedelta

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'password', 'referral_code')
        extra_kwargs = {
            'password': {'write_only': True},
            'referral_code': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        # Remove referral_code from validated_data as it's not a model field
        referral_code = validated_data.pop('referral_code', None)
        
        # Create user with remaining data
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']
        )
        
        # Set referred_by if provided in context
        if 'referred_by' in self.context:
            user.referred_by = self.context['referred_by']
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
        fields = ('id', 'username', 'email', 'phone_number', 'referral_code', 'referral_earnings')
        read_only_fields = ('referral_code', 'referral_earnings')

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number']

class InvestmentSerializer(serializers.ModelSerializer):
    user = UserMinimalSerializer(read_only=True)
    maturity_period = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Investment
        fields = [
            'id', 'user', 'amount', 'created_at', 'maturity_period',
            'status', 'return_amount', 'referral_bonus_used',
            'maturity_date', 'mature_at'
        ]
        read_only_fields = [
            'id', 'user', 'created_at', 'status',
            'return_amount', 'referral_bonus_used', 'maturity_date',
            'mature_at'
        ]

    def validate_amount(self, value):
        if value < 100:
            raise serializers.ValidationError("Minimum investment amount is Ksh 100")
        return value

    def validate_maturity_period(self, value):
        """
        Validate the maturity period.
        """
        if value <= 0:
            raise serializers.ValidationError("Maturity period must be greater than 0 days")
        
        # You can add maximum maturity period validation here
        # if value > 365:
        #     raise serializers.ValidationError("Maximum maturity period is 365 days")
        
        return value

    @transaction.atomic
    def create(self, validated_data):
        """
        Create and return a new Investment instance.
        """
        user = self.context['request'].user
        maturity_period = validated_data.pop('maturity_period')
        amount = validated_data['amount']
        
        # Calculate maturity date using timedelta
        maturity_date = timezone.now() + timedelta(days=maturity_period)
        
        # Calculate return amount
        daily_interest = Decimal('0.02')  # 2% daily interest
        interest_amount = amount * daily_interest * maturity_period
        return_amount = amount + interest_amount
        
        investment = Investment.objects.create(
            user=user,
            maturity_date=maturity_date,
            return_amount=return_amount,
            **validated_data
        )
        
        # Handle referral bonus if user was referred
        if user.referred_by:
            # Calculate referral bonus (3% of investment amount)
            referral_bonus = amount * Decimal('0.03')
            
            # Update or create referral history
            referral_history, created = ReferralHistory.objects.get_or_create(
                referrer=user.referred_by,
                referred=user,
                defaults={
                    'amount_invested': amount,
                    'bonus_earned': referral_bonus,
                    'status': 'pending'
                }
            )
            
            if not created:
                # Update existing referral history
                referral_history.amount_invested += amount
                referral_history.bonus_earned += referral_bonus
                referral_history.save()
            
            # Update referrer's earnings
            user.referred_by.referral_earnings += referral_bonus
            user.referred_by.save()
            
            # Handle existing referral bonus if available
            if user.referral_earnings > 0:
                if amount >= user.referral_earnings:
                    investment.referral_bonus_used = user.referral_earnings
                    investment.return_amount += user.referral_earnings
                    user.referral_earnings = 0
                    user.save()
                    
                    # Mark referral history as used
                    ReferralHistory.objects.filter(
                        referrer=user.referred_by,
                        referred=user,
                        status='pending'
                    ).update(status='used', used_at=timezone.now())
        
        investment.save()
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