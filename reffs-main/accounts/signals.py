from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from decimal import Decimal
from accounts.models import ReferralHistory, Investment

# Removing the signal handler to prevent duplicate referral history entries
# The referral history creation is now handled exclusively in the InvestmentSerializer 