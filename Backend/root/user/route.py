from django.urls import path
from .consumer import PersonalChatConsumer

websocket_urlpatterns = [
    path('ws/chat/', PersonalChatConsumer.as_asgi()),
]