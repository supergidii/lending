from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from accounts.models import User, Investment, PairedInvestment
from accounts.tasks import run_pairing_job

class Command(BaseCommand):
    help = 'Test the investment pairing system'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== Starting Pairing System Test ===\n'))
        
        try:
            # Create test users
            users = []
            for i in range(4):
                try:
                    user = User.objects.create(
                        username=f'test_user_{i}',
                        email=f'test_user_{i}@example.com',
                        phone_number=f'123456789{i}',
                        password='testpass123'
                    )
                    users.append(user)
                    self.stdout.write(self.style.SUCCESS(f"Created user: {user.username}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error creating user {i}: {str(e)}"))
            
            if not users:
                self.stdout.write(self.style.ERROR("Failed to create test users. Exiting."))
                return
            
            # Create test investments
            investments = []
            
            # Create matured investments
            for i in range(2):
                try:
                    investment = Investment.objects.create(
                        user=users[i],
                        amount=Decimal('1000.00'),
                        maturity_period=30,
                        status='matured',
                        return_amount=Decimal('1600.00')  # 1000 + (1000 * 0.02 * 30)
                    )
                    investments.append(investment)
                    self.stdout.write(self.style.SUCCESS(
                        f"Created matured investment: {investment.id} for {investment.user.username}"
                    ))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f"Error creating matured investment for user {i}: {str(e)}"
                    ))
            
            # Create new investments
            for i in range(2, 4):
                try:
                    investment = Investment.objects.create(
                        user=users[i],
                        amount=Decimal('1500.00'),
                        maturity_period=30,
                        status='pending'
                    )
                    investments.append(investment)
                    self.stdout.write(self.style.SUCCESS(
                        f"Created new investment: {investment.id} for {investment.user.username}"
                    ))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(
                        f"Error creating new investment for user {i}: {str(e)}"
                    ))
            
            if not investments:
                self.stdout.write(self.style.ERROR("Failed to create test investments. Exiting."))
                return
            
            self.stdout.write(self.style.SUCCESS('\n=== Running Pairing Process ===\n'))
            
            # Run the pairing job
            run_pairing_job()
            
            # Check results
            self.stdout.write(self.style.SUCCESS('\n=== Checking Results ===\n'))
            
            # Check matured investments
            matured_investments = Investment.objects.filter(status='matured')
            self.stdout.write(self.style.SUCCESS(
                f"Matured investments remaining: {matured_investments.count()}"
            ))
            
            # Check paired investments
            paired_investments = Investment.objects.filter(status='paired')
            self.stdout.write(self.style.SUCCESS(
                f"Paired investments: {paired_investments.count()}"
            ))
            
            # Check PairedInvestment records
            paired_records = PairedInvestment.objects.all()
            self.stdout.write(self.style.SUCCESS(
                f"\nPairedInvestment records created: {paired_records.count()}"
            ))
            
            for investment in paired_investments:
                self.stdout.write(self.style.SUCCESS(f"\nInvestment {investment.id}:"))
                self.stdout.write(f"User: {investment.user.username}")
                self.stdout.write(f"Amount: ${investment.amount}")
                self.stdout.write(f"Paired to: {investment.paired_to.username if investment.paired_to else 'None'}")
                self.stdout.write(f"Status: {investment.status}")
            
            for record in paired_records:
                self.stdout.write(self.style.SUCCESS(f"\nPairedInvestment {record.id}:"))
                self.stdout.write(f"Matured Investor: {record.matured_investor.username}")
                self.stdout.write(f"New Investor: {record.new_investor.username}")
                self.stdout.write(f"Amount Paired: ${record.amount_paired}")
                self.stdout.write(f"Status: {record.status}")
                self.stdout.write(f"Payment Status: {record.payment_status}")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error in test_pairing_system: {str(e)}")) 