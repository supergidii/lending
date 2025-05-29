from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Investment
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Fixes orphaned investments by either deleting them or reassigning them to a default user'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete',
            action='store_true',
            help='Delete orphaned investments instead of reassigning them',
        )
        parser.add_argument(
            '--default-user',
            type=int,
            help='ID of the default user to reassign orphaned investments to',
        )

    def handle(self, *args, **options):
        with transaction.atomic():
            # Get all investments
            investments = Investment.objects.all()
            orphaned_count = 0
            fixed_count = 0

            for investment in investments:
                try:
                    # Try to access the user to check if it exists
                    _ = investment.user
                except User.DoesNotExist:
                    orphaned_count += 1
                    if options['delete']:
                        investment.delete()
                        self.stdout.write(
                            self.style.WARNING(f'Deleted orphaned investment {investment.id}')
                        )
                    elif options['default_user']:
                        try:
                            default_user = User.objects.get(id=options['default_user'])
                            investment.user = default_user
                            investment.save()
                            fixed_count += 1
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f'Reassigned investment {investment.id} to user {default_user.username}'
                                )
                            )
                        except User.DoesNotExist:
                            self.stdout.write(
                                self.style.ERROR(
                                    f'Default user {options["default_user"]} does not exist'
                                )
                            )
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f'Found orphaned investment {investment.id} but no action specified'
                            )
                        )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Found {orphaned_count} orphaned investments. Fixed {fixed_count} investments.'
                )
            ) 