from django.test import TestCase, Client
from django.urls import reverse
from .models import User, ReferralHistory, Investment, PairedInvestment, Payment
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status
from django.db.models import Sum
import random
import time
from django.test.utils import override_settings
from django.core.cache import cache

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

class InvestmentSystemTest(TestCase):
    def setUp(self):
        # Create test users
        self.users = []
        for i in range(30):
            user = User.objects.create_user(
                username=f'testuser{i}',
                phone_number=f'0712345{i:04d}',
                password='testpass123',
                email=f'test{i}@example.com'
            )
            self.users.append(user)

        # Create referral relationships
        for i in range(1, 30):
            self.users[i].referred_by = self.users[0]
            self.users[i].save()

        # Create investments for each user
        self.investments = []
        for user in self.users:
            # Create matured investment
            matured_investment = Investment.objects.create(
                user=user,
                amount=Decimal('1000.00'),
                maturity_period=30,
                return_amount=Decimal('1600.00'),
                status='matured',
                mature_at=timezone.now() - timedelta(days=1)
            )
            self.investments.append(matured_investment)

            # Create new investment
            new_investment = Investment.objects.create(
                user=user,
                amount=Decimal('2000.00'),
                maturity_period=60,
                return_amount=Decimal('4400.00'),
                status='pending'
            )
            self.investments.append(new_investment)

        # Create referral histories
        self.referral_histories = []
        for i in range(1, 30):
            history = ReferralHistory.objects.create(
                referrer=self.users[0],
                referred=self.users[i],
                amount_invested=Decimal('1000.00'),
                bonus_earned=Decimal('30.00'),
                status='active',
                payment_confirmed=True
            )
            self.referral_histories.append(history)

        # Create some paired investments
        self.paired_investments = []
        for i in range(0, 30, 2):
            if i + 1 < len(self.users):
                paired = PairedInvestment.objects.create(
                    matured_investor=self.users[i],
                    new_investor=self.users[i + 1],
                    amount_paired=Decimal('1000.00'),
                    status='confirmed',
                    payment_status='paid'
                )
                self.paired_investments.append(paired)

    def test_user_creation(self):
        """Test if users were created correctly"""
        self.assertEqual(User.objects.count(), 30)
        self.assertEqual(self.users[0].referred_users.count(), 29)

    def test_investment_creation(self):
        """Test if investments were created correctly"""
        self.assertEqual(Investment.objects.count(), 60)  # 30 users * 2 investments each
        self.assertEqual(Investment.objects.filter(status='matured').count(), 30)
        self.assertEqual(Investment.objects.filter(status='pending').count(), 30)

    def test_referral_history(self):
        """Test referral history creation and calculations"""
        self.assertEqual(ReferralHistory.objects.count(), 29)
        total_bonus = ReferralHistory.objects.aggregate(
            total=Sum('bonus_earned')
        )['total']
        self.assertEqual(total_bonus, Decimal('870.00'))  # 29 referrals * 30.00 bonus

    def test_paired_investments(self):
        """Test paired investments creation"""
        self.assertEqual(PairedInvestment.objects.count(), 15)  # 30 users paired in groups of 2
        self.assertEqual(
            PairedInvestment.objects.filter(status='confirmed').count(),
            15
        )

    def test_dashboard_data(self):
        """Test dashboard data retrieval"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.get(reverse('user-dashboard'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        # Test statistics
        self.assertIn('statistics', data)
        stats = data['statistics']
        self.assertGreater(stats['total_referral_earnings'], 0)
        self.assertGreater(stats['available_bonus'], 0)
        self.assertGreater(stats['total_investment'], 0)

    def test_referral_list(self):
        """Test referral list data retrieval"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.get(reverse('referral-history-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        
        self.assertIn('total_referrals', data)
        self.assertIn('total_earnings', data)
        self.assertIn('available_bonus', data)
        self.assertEqual(data['total_referrals'], 29)

    def test_investment_creation_api(self):
        """Test investment creation through API"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        
        data = {
            'amount': '5000.00',
            'maturity_period': 30
        }
        response = client.post(reverse('investment-create'), data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('return_amount', response.data)
        self.assertIn('maturity_date', response.data)

    def test_payment_confirmation(self):
        """Test payment confirmation process"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        
        # Get a paired investment
        paired = self.paired_investments[0]
        response = client.post(
            reverse('confirm-payment', args=[paired.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_referral_bonus_calculation(self):
        """Test referral bonus calculation and application"""
        # Create a new investment for a referred user
        referred_user = self.users[1]
        investment = Investment.objects.create(
            user=referred_user,
            amount=Decimal('10000.00'),
            maturity_period=30,
            return_amount=Decimal('16000.00'),
            status='pending'
        )
        
        # Check if referral bonus was created
        referral = ReferralHistory.objects.get(
            referrer=self.users[0],
            referred=referred_user
        )
        self.assertEqual(referral.bonus_earned, Decimal('300.00'))  # 3% of 10000

    def test_investment_maturity(self):
        """Test investment maturity process"""
        # Get a matured investment
        matured = Investment.objects.filter(status='matured').first()
        
        # Check if return amount is correct
        expected_return = matured.amount * Decimal('1.6')  # 60% return
        self.assertEqual(matured.return_amount, expected_return)

    def test_user_dashboard_statistics(self):
        """Test dashboard statistics accuracy"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.get(reverse('user-dashboard'))
        
        data = response.data['statistics']
        
        # Verify total investment
        total_investment = Investment.objects.filter(
            user=self.users[0]
        ).aggregate(
            total=Sum('amount')
        )['total']
        self.assertEqual(
            Decimal(str(data['total_investment'])),
            total_investment
        )
        
        # Verify total referral earnings
        total_earnings = ReferralHistory.objects.filter(
            referrer=self.users[0]
        ).aggregate(
            total=Sum('bonus_earned')
        )['total']
        self.assertEqual(
            Decimal(str(data['total_referral_earnings'])),
            total_earnings
        )

    def test_referral_chain(self):
        """Test multi-level referral chain"""
        # Create a chain of referrals
        user1 = self.users[0]
        user2 = self.users[1]
        user3 = self.users[2]
        
        # Set up referral chain
        user2.referred_by = user1
        user2.save()
        user3.referred_by = user2
        user3.save()
        
        # Create investment for user3
        investment = Investment.objects.create(
            user=user3,
            amount=Decimal('10000.00'),
            maturity_period=30,
            return_amount=Decimal('16000.00'),
            status='pending'
        )
        
        # Check if both referrers got their bonuses
        bonus1 = ReferralHistory.objects.get(
            referrer=user1,
            referred=user3
        ).bonus_earned
        bonus2 = ReferralHistory.objects.get(
            referrer=user2,
            referred=user3
        ).bonus_earned
        
        self.assertEqual(bonus1, Decimal('300.00'))  # 3% of 10000
        self.assertEqual(bonus2, Decimal('300.00'))  # 3% of 10000

    def test_investment_pairing(self):
        """Test investment pairing process"""
        # Get a matured investment
        matured = Investment.objects.filter(status='matured').first()
        # Get a pending investment
        pending = Investment.objects.filter(status='pending').first()
        
        # Create pairing
        paired = PairedInvestment.objects.create(
            matured_investor=matured.user,
            new_investor=pending.user,
            amount_paired=Decimal('1000.00'),
            status='pending',
            payment_status='pending'
        )
        
        # Verify pairing
        self.assertEqual(paired.matured_investor, matured.user)
        self.assertEqual(paired.new_investor, pending.user)
        self.assertEqual(paired.amount_paired, Decimal('1000.00'))

    def test_payment_flow(self):
        """Test complete payment flow"""
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        
        # Create a new investment
        investment_data = {
            'amount': '5000.00',
            'maturity_period': 30
        }
        response = client.post(reverse('investment-create'), investment_data)
        investment_id = response.data['id']
        
        # Create payment
        payment = Payment.objects.create(
            from_user=self.users[0],
            to_user=self.users[1],
            amount=Decimal('5000.00'),
            status='pending'
        )
        
        # Confirm payment
        response = client.post(
            reverse('confirm-payment', args=[payment.id])
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify payment status
        payment.refresh_from_db()
        self.assertEqual(payment.status, 'confirmed')

class EdgeCaseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone_number='0712345678',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_invalid_investment_amount(self):
        """Test investment creation with invalid amounts"""
        invalid_amounts = [
            '0.00',  # Zero amount
            '-1000.00',  # Negative amount
            '1000000000.00',  # Extremely large amount
            'abc',  # Non-numeric
            '',  # Empty
        ]
        
        for amount in invalid_amounts:
            response = self.client.post(reverse('investment-create'), {
                'amount': amount,
                'maturity_period': 30
            })
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_maturity_period(self):
        """Test investment creation with invalid maturity periods"""
        invalid_periods = [
            '0',  # Zero days
            '-30',  # Negative days
            '1000',  # Extremely long period
            'abc',  # Non-numeric
            '',  # Empty
        ]
        
        for period in invalid_periods:
            response = self.client.post(reverse('investment-create'), {
                'amount': '1000.00',
                'maturity_period': period
            })
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_referral_code(self):
        """Test registration with duplicate referral code"""
        # Create first user
        response = self.client.post(reverse('register'), {
            'username': 'user1',
            'email': 'user1@example.com',
            'phone_number': '0712345679',
            'password': 'testpass123',
            'referral_code': 'TEST123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Try to create second user with same referral code
        response = self.client.post(reverse('register'), {
            'username': 'user2',
            'email': 'user2@example.com',
            'phone_number': '0712345680',
            'password': 'testpass123',
            'referral_code': 'TEST123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_concurrent_payment_confirmation(self):
        """Test concurrent payment confirmation attempts"""
        # Create a payment
        payment = Payment.objects.create(
            from_user=self.user,
            to_user=User.objects.create_user(
                username='other',
                email='other@example.com',
                phone_number='0712345681',
                password='testpass123'
            ),
            amount=Decimal('1000.00'),
            status='pending'
        )

        # Simulate concurrent confirmation attempts
        def confirm_payment():
            return self.client.post(reverse('confirm-payment', args=[payment.id]))

        # Make multiple concurrent requests
        responses = [confirm_payment() for _ in range(5)]
        
        # Only one should succeed
        success_count = sum(1 for r in responses if r.status_code == status.HTTP_200_OK)
        self.assertEqual(success_count, 1)

class PerformanceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone_number='0712345678',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_dashboard_load_performance(self):
        """Test dashboard load time with large dataset"""
        # Create 1000 investments
        for i in range(1000):
            Investment.objects.create(
                user=self.user,
                amount=Decimal('1000.00'),
                maturity_period=30,
                return_amount=Decimal('1600.00'),
                status='pending'
            )

        # Measure dashboard load time
        start_time = time.time()
        response = self.client.get(reverse('user-dashboard'))
        load_time = time.time() - start_time

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(load_time, 1.0)  # Should load in less than 1 second

    def test_referral_list_performance(self):
        """Test referral list load time with large dataset"""
        # Create 1000 referred users
        for i in range(1000):
            referred = User.objects.create_user(
                username=f'referred{i}',
                email=f'referred{i}@example.com',
                phone_number=f'0712345{i:04d}',
                password='testpass123'
            )
            ReferralHistory.objects.create(
                referrer=self.user,
                referred=referred,
                amount_invested=Decimal('1000.00'),
                bonus_earned=Decimal('30.00'),
                status='active'
            )

        # Measure referral list load time
        start_time = time.time()
        response = self.client.get(reverse('referral-history-list'))
        load_time = time.time() - start_time

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(load_time, 1.0)  # Should load in less than 1 second

    @override_settings(CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    })
    def test_dashboard_caching(self):
        """Test dashboard response caching"""
        # First request
        start_time = time.time()
        response1 = self.client.get(reverse('user-dashboard'))
        first_load_time = time.time() - start_time

        # Second request (should be cached)
        start_time = time.time()
        response2 = self.client.get(reverse('user-dashboard'))
        second_load_time = time.time() - start_time

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertLess(second_load_time, first_load_time)

class APITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone_number='0712345678',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_investment_api_endpoints(self):
        """Test all investment-related API endpoints"""
        # Create investment
        create_response = self.client.post(reverse('investment-create'), {
            'amount': '1000.00',
            'maturity_period': 30
        })
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        investment_id = create_response.data['id']

        # Get investment details
        detail_response = self.client.get(
            reverse('investment-detail', args=[investment_id])
        )
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)

        # List investments
        list_response = self.client.get(reverse('investment-list'))
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)

    def test_referral_api_endpoints(self):
        """Test all referral-related API endpoints"""
        # Create referral
        referred = User.objects.create_user(
            username='referred',
            email='referred@example.com',
            phone_number='0712345679',
            password='testpass123'
        )
        
        # Get referral code
        code_response = self.client.get(reverse('referral-code'))
        self.assertEqual(code_response.status_code, status.HTTP_200_OK)
        self.assertIn('referral_code', code_response.data)

        # Get referral history
        history_response = self.client.get(reverse('referral-history-list'))
        self.assertEqual(history_response.status_code, status.HTTP_200_OK)

    def test_payment_api_endpoints(self):
        """Test all payment-related API endpoints"""
        # Create payment
        payment = Payment.objects.create(
            from_user=self.user,
            to_user=User.objects.create_user(
                username='other',
                email='other@example.com',
                phone_number='0712345680',
                password='testpass123'
            ),
            amount=Decimal('1000.00'),
            status='pending'
        )

        # Confirm payment
        confirm_response = self.client.post(
            reverse('confirm-payment', args=[payment.id])
        )
        self.assertEqual(confirm_response.status_code, status.HTTP_200_OK)

        # Get payment history
        history_response = self.client.get(reverse('payment-history'))
        self.assertEqual(history_response.status_code, status.HTTP_200_OK)

    def test_api_error_handling(self):
        """Test API error handling"""
        # Test invalid investment creation
        response = self.client.post(reverse('investment-create'), {
            'amount': 'invalid',
            'maturity_period': 'invalid'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

        # Test invalid payment confirmation
        response = self.client.post(
            reverse('confirm-payment', args=[99999])  # Non-existent payment
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Test unauthorized access
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('user-dashboard'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_api_rate_limiting(self):
        """Test API rate limiting"""
        # Make multiple requests in quick succession
        for _ in range(100):
            response = self.client.get(reverse('user-dashboard'))
            
        # The last request should be rate limited
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_api_versioning(self):
        """Test API versioning"""
        # Test v1 endpoints
        v1_response = self.client.get('/api/v1/user-dashboard/')
        self.assertEqual(v1_response.status_code, status.HTTP_200_OK)

        # Test v2 endpoints (if implemented)
        v2_response = self.client.get('/api/v2/user-dashboard/')
        self.assertIn(v2_response.status_code, 
                     [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_api_documentation(self):
        """Test API documentation endpoints"""
        # Test Swagger documentation
        swagger_response = self.client.get('/api/docs/')
        self.assertEqual(swagger_response.status_code, status.HTTP_200_OK)

        # Test ReDoc documentation
        redoc_response = self.client.get('/api/redoc/')
        self.assertEqual(redoc_response.status_code, status.HTTP_200_OK)
