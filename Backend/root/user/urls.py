from django.urls import path
from .views import *

urlpatterns = [
    path('getUsers/', user_list, name='user-list'),
    path('getUsers/<str:pk>', get_user, name='user-detail'),
    path('getUserId/', user_id, name='user-id'),
    path('conversation/', ConversationCreateIfNotExistsView.as_view(), name='conversation-create'),
    path('getMessages/<str:pk>/', get_messages, name='get-messages'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
