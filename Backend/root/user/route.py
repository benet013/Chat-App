from django.urls import path,re_path
from .consumer import PersonalChatConsumer

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<room_name>[^/]+)/$", PersonalChatConsumer.as_asgi()),
]