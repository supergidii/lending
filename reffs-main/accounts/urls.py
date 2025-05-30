from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, UserLoginView, UserProfileView,
    InvestmentCreateView, InvestmentListView,
    ReferralHistoryListView, InvestmentStatementPDFView,
    ReferralStatementPDFView, system_overview, user_dashboard,
    DashboardView, BuySharesView, SellSharesView, ReferralsView,
    CustomLoginView, CustomLogoutView, MyInvestmentsView, sell_shares,
    my_investments, ConfirmPaymentView, InvestmentDetailView,
    WithdrawBonusView, WithdrawHistoryListView, WithdrawHistoryDetailView,
    WithdrawHistoryCreateView, WithdrawHistoryUpdateView, WithdrawHistoryDeleteView
)

urlpatterns = [
    # Authentication endpoints
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Investment endpoints
    path('investments/create/', InvestmentCreateView.as_view(), name='investment_create'),
    path('investments/', InvestmentListView.as_view(), name='investment_list'),
    path('investments/<int:pk>/', InvestmentDetailView.as_view(), name='investment_detail'),
    path('confirm-payment/<int:investment_id>/', ConfirmPaymentView.as_view(), name='confirm_payment'),
    path('my_investments/', my_investments, name='api_my_investments'),
    
    # Referral endpoints
    path('referrals/', ReferralHistoryListView.as_view(), name='referral_list'),
    path('referrals/history/', ReferralHistoryListView.as_view(), name='referral_history'),

    # Statement PDF endpoints
    path('investments/<int:investment_id>/statement/', InvestmentStatementPDFView.as_view(), name='investment_statement_pdf'),
    path('referrals/statement/', ReferralStatementPDFView.as_view(), name='referral_statement_pdf'),

    # System overview endpoint
    path('system-overview/', system_overview, name='system_overview'),

    # User dashboard endpoint
    path('user-dashboard/', user_dashboard, name='user_dashboard'),

    # API endpoints
    path('sell-shares/', sell_shares, name='api_sell_shares'),

    # Template-based views
    path('', DashboardView.as_view(), name='dashboard'),
    path('buy-shares/', BuySharesView.as_view(), name='buy_shares'),
    path('sell-shares/', SellSharesView.as_view(), name='sell_shares'),
    path('referrals/', ReferralsView.as_view(), name='referrals'),
    path('my-investments/', MyInvestmentsView.as_view(), name='my_investments'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('auth/logout/', CustomLogoutView.as_view(), name='logout'),
    path('withdraw-bonus/', WithdrawBonusView.as_view(), name='withdraw_bonus'),
    path('withdraw-history/', WithdrawHistoryListView.as_view(), name='withdraw_history_list'),
    path('withdraw-history/<int:pk>/', WithdrawHistoryDetailView.as_view(), name='withdraw_history_detail'),
    path('withdraw-history/create/', WithdrawHistoryCreateView.as_view(), name='withdraw_history_create'),
    path('withdraw-history/<int:pk>/update/', WithdrawHistoryUpdateView.as_view(), name='withdraw_history_update'),
    path('withdraw-history/<int:pk>/delete/', WithdrawHistoryDeleteView.as_view(), name='withdraw_history_delete'),
] 