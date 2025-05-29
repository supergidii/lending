from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Investment, ReferralHistory, Pairing, PairedInvestment
from django.utils import timezone

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone_number', 'referral_code', 'referral_earnings', 'is_banned', 'banned_at')
    search_fields = ('username', 'email', 'phone_number', 'referral_code')
    list_filter = ('is_active', 'is_staff', 'is_banned', 'date_joined')
    actions = ['ban_users', 'unban_users']
    fieldsets = UserAdmin.fieldsets + (
        ('Referral Information', {'fields': ('phone_number', 'referral_code', 'referred_by', 'referral_earnings')}),
        ('Ban Information', {'fields': ('is_banned', 'ban_reason', 'banned_at')}),
    )

    def ban_users(self, request, queryset):
        for user in queryset:
            user.is_banned = True
            user.banned_at = timezone.now()
            user.save()
        self.message_user(request, f"Successfully banned {queryset.count()} users.")
    ban_users.short_description = "Ban selected users"

    def unban_users(self, request, queryset):
        for user in queryset:
            user.is_banned = False
            user.ban_reason = None
            user.banned_at = None
            user.save()
        self.message_user(request, f"Successfully unbanned {queryset.count()} users.")
    unban_users.short_description = "Unban selected users"

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'maturity_date', 'status', 'created_at', 'return_amount')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email')
    date_hierarchy = 'created_at'

@admin.register(PairedInvestment)
class PairedInvestmentAdmin(admin.ModelAdmin):
    list_display = ('matured_investor', 'new_investor', 'amount_paired', 'status', 'payment_status', 'paired_at')
    list_filter = ('status', 'payment_status', 'paired_at')
    search_fields = ('matured_investor__username', 'new_investor__username')
    date_hierarchy = 'paired_at'

@admin.register(ReferralHistory)
class ReferralHistoryAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred', 'amount_invested', 'bonus_earned', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('referrer__username', 'referred__username')
    date_hierarchy = 'created_at'

@admin.register(Pairing)
class PairingAdmin(admin.ModelAdmin):
    list_display = ('matured_investment', 'new_investment_id', 'amount_paired', 'status', 'payment_status', 'paired_at')
    list_filter = ('status', 'payment_status', 'paired_at')
    search_fields = ('matured_investment__user__username', 'new_investment_id__user__username')
    date_hierarchy = 'paired_at'
   

