from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounts.views import UserLoginView, UserRegistrationView
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Create your views here.

@csrf_exempt
@api_view(['GET'])
def welcome_page(request):
    """
    View to render the welcome page with necessary data
    """
    try:
        context = {
            'news': [
                {
                    'title': 'Platform Update',
                    'description': 'Latest updates and improvements to our investment platform.',
                    'date': '2024-03-20'
                },
                {
                    'title': 'New Features',
                    'description': 'Check out our latest features and improvements.',
                    'date': '2024-03-19'
                }
            ],
            'blog_posts': [
                {
                    'title': 'Investment Tips',
                    'description': 'Learn the best practices for successful investing.',
                    'date': '2024-03-19'
                },
                {
                    'title': 'Market Analysis',
                    'description': 'Latest market trends and analysis.',
                    'date': '2024-03-18'
                }
            ]
        }
        return Response(context, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@api_view(['POST'])
def handle_login(request):
    """
    Handle login requests by forwarding to accounts login view
    """
    view = UserLoginView.as_view()
    return view(request._request)

@csrf_exempt
@api_view(['POST'])
def handle_register(request):
    """
    Handle registration requests by forwarding to accounts register view
    """
    view = UserRegistrationView.as_view()
    return view(request._request)
