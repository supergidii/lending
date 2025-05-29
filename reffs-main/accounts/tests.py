from django.test import TestCase, Client
from django.urls import reverse
from .models import User, ReferralHistory
from decimal import Decimal

# Create your tests here.

class ReferralSystemTest(TestCase):
    def setUp(self):
        # Create a referrer user
        self.referrer = User.objects.create_user(
            username='referrer',
            email='referrer@test.com',
            phone_number='0712345678',
            password='testpass123'
        )
        
        # Create a client for making requests
        self.client = Client()

    def test_registration_with_referral_code(self):
        """Test that registration with a referral code properly sets referred_by"""
        # Get the registration URL with the referral code
        registration_url = reverse('register')
        
        # Register a new user with the referral code
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'phone_number': '0798765432',
            'password': 'testpass123',
            'referral_code': self.referrer.referral_code
        }
        
        response = self.client.post(registration_url, registration_data, format='json')
        self.assertEqual(response.status_code, 201)  # Created
        
        # Verify the new user was created with the correct referrer
        new_user = User.objects.get(username='newuser')
        self.assertEqual(new_user.referred_by, self.referrer)
        
        # Verify a referral history entry was created
        referral_history = ReferralHistory.objects.get(referred=new_user)
        self.assertEqual(referral_history.referrer, self.referrer)
        self.assertEqual(referral_history.amount_invested, Decimal('0'))
        self.assertEqual(referral_history.bonus_earned, Decimal('0'))
        self.assertEqual(referral_history.status, 'pending')
