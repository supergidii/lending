from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('welcome/', views.welcome_page, name='welcome'),
    path('api/auth/login/', views.handle_login, name='login'),
    path('api/auth/register/', views.handle_register, name='register'),
]