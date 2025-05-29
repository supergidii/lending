from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fixes database integrity issues by removing invalid foreign key references'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Get all user IDs from the accounts_user table
            cursor.execute("SELECT id FROM accounts_user")
            valid_user_ids = {row[0] for row in cursor.fetchall()}

            # Find and fix invalid user references in investments
            cursor.execute("SELECT id, user_id FROM accounts_investment")
            for investment_id, user_id in cursor.fetchall():
                if user_id not in valid_user_ids:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Found invalid user reference in investment {investment_id} (user_id: {user_id})'
                        )
                    )
                    # Delete the invalid investment
                    cursor.execute(
                        "DELETE FROM accounts_investment WHERE id = ?",
                        [investment_id]
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f'Deleted investment {investment_id}')
                    )

            self.stdout.write(self.style.SUCCESS('Database integrity check completed')) 