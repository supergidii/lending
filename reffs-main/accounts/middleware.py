from django.http import JsonResponse
from django.utils import timezone
from rest_framework import status

class BannedUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip middleware for login, registration, and public endpoints
        public_endpoints = [
            '/api/login/',
            '/api/register/',
            '/api/token/',
            '/api/token/refresh/',
        ]
        
        if request.path in public_endpoints:
            return self.get_response(request)

        # Check if user is authenticated and banned
        if request.user.is_authenticated and request.user.is_banned:
            # For API requests, return JSON response
            if request.path.startswith('/api/'):
                return JsonResponse({
                    'error': 'Your account has been banned',
                    'reason': request.user.ban_reason,
                    'banned_at': request.user.banned_at
                }, status=status.HTTP_403_FORBIDDEN)
            # For other requests, redirect to a ban page or show error
            else:
                return JsonResponse({
                    'error': 'Your account has been banned',
                    'reason': request.user.ban_reason,
                    'banned_at': request.user.banned_at
                }, status=status.HTTP_403_FORBIDDEN)

        return self.get_response(request) 