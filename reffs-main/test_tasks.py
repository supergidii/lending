import os
import django
from datetime import timedelta
from django.utils import timezone
import random
import time
from decimal import Decimal

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'referral_system.settings')
django.setup()

from accounts.models import User, Investment, PairedInvestment, Payment
from accounts.tasks import check_matured_investments, run_pairing_job

def cleanup_test_data():
    """Clean up any existing test data"""
    User.objects.filter(username__startswith='testuser').delete()
    Investment.objects.filter(user__username__startswith='testuser').delete()
    PairedInvestment.objects.filter(matured_investor__username__startswith='testuser').delete()
    Payment.objects.filter(from_user__username__startswith='testuser').delete()

def create_test_data():
    # Clean up any existing test data
    cleanup_test_data()
    
    # Generate unique phone numbers
    phone1 = f"1234567{random.randint(100, 999)}"
    phone2 = f"9876543{random.randint(100, 999)}"
    
    # Create test users
    user1 = User.objects.create_user(
        username='testuser1',
        email='test1@example.com',
        password='testpass123',
        phone_number=phone1
    )
    
    user2 = User.objects.create_user(
        username='testuser2',
        email='test2@example.com',
        password='testpass123',
        phone_number=phone2
    )
    
    # Create a matured investment
    investment = Investment.objects.create(
        user=user1,
        amount=Decimal('1000.00'),
        maturity_period=1,
        status='pending',
        created_at=timezone.now() - timedelta(days=2)  # Created 2 days ago
    )
    
    print(f"Created test investment: {investment.id}")
    return user1, user2, investment

def test_maturity_check():
    print("\nTesting maturity check...")
    check_matured_investments()
    
    # Verify the investment status was updated
    matured_investments = Investment.objects.filter(status='matured')
    print(f"Matured investments: {matured_investments.count()}")
    for investment in matured_investments:
        print(f"Investment {investment.id} status: {investment.status}, return_amount: {investment.return_amount}")

def test_pairing():
    print("\nTesting pairing...")
    # Create test data
    user1, user2, _ = create_test_data()
    
    # First, create and mature an investment
    matured_investment = Investment.objects.create(
        user=user1,
        amount=Decimal('1000.00'),
        maturity_period=1,
        status='pending'
    )
    # Set created_at to 2 days ago to ensure maturity
    matured_investment.created_at = timezone.now() - timedelta(days=2)
    matured_investment.save()
    
    # Calculate expected return amount
    daily_interest_rate = Decimal('0.02')
    interest_amount = matured_investment.amount * daily_interest_rate * matured_investment.maturity_period
    expected_return = matured_investment.amount + interest_amount
    
    print(f"\nCreated matured investment:")
    print(f"ID: {matured_investment.id}")
    print(f"Amount: {matured_investment.amount}")
    print(f"Expected return amount: {expected_return}")
    print(f"Created at: {matured_investment.created_at}")
    print(f"Maturity period: {matured_investment.maturity_period} days")
    
    # Run maturity check
    print("\nRunning maturity check...")
    check_matured_investments()
    
    # Verify the investment was matured
    matured_investments = Investment.objects.filter(status='matured')
    if not matured_investments.exists():
        print("Error: No matured investments found after maturity check")
        return
    
    print(f"\nMatured investments: {matured_investments.count()}")
    for investment in matured_investments:
        print(f"Investment {investment.id}")
        print(f"Amount: {investment.amount}")
        print(f"Return amount: {investment.return_amount}")
        print(f"User: {investment.user.username}")
    
    # Create a new investment to be paired
    new_investment = Investment.objects.create(
        user=user2,
        amount=Decimal('500.00'),  # This amount should be less than or equal to the matured investment amount
        maturity_period=1,
        status='pending'
    )
    
    print(f"\nCreated new investment:")
    print(f"ID: {new_investment.id}")
    print(f"Amount: {new_investment.amount}")
    print(f"User: {new_investment.user.username}")
    
    # Run pairing job
    print("\nRunning pairing job...")
    run_pairing_job()
    
    # Verify pairing
    paired_investments = Investment.objects.filter(status='paired')
    print(f"\nPaired investments: {paired_investments.count()}")
    for investment in paired_investments:
        print(f"\nInvestment {investment.id}:")
        print(f"Amount: {investment.amount}")
        print(f"Status: {investment.status}")
        print(f"Paired to: {investment.paired_to.username if investment.paired_to else 'None'}")
    
    # Verify PairedInvestment records
    paired_records = PairedInvestment.objects.all()
    print(f"\nPairedInvestment records: {paired_records.count()}")
    for record in paired_records:
        print(f"\nPairedInvestment {record.id}:")
        print(f"Matured Investor: {record.matured_investor.username}")
        print(f"New Investor: {record.new_investor.username}")
        print(f"Amount Paired: {record.amount_paired}")
        print(f"Status: {record.status}")
        print(f"Payment Status: {record.payment_status}")
    
    # Verify payments
    payments = Payment.objects.all()
    print(f"\nCreated payments: {payments.count()}")
    for payment in payments:
        print(f"\nPayment {payment.id}:")
        print(f"Amount: {payment.amount}")
        print(f"From: {payment.from_user.username}")
        print(f"To: {payment.to_user.username}")
        print(f"Status: {payment.status}")

if __name__ == '__main__':
    try:
        print("Starting test...")
        test_pairing()  # Run only the pairing test which includes maturity check
        print("\nTest completed successfully!")
    except Exception as e:
        print(f"\nTest failed with error: {str(e)}")
    finally:
        # Clean up test data
        cleanup_test_data()
        print("Test data cleaned up.") 