import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from user.route import websocket_urlpatterns
from user.middleware import JwtCookieAuthMiddleware

settings_module = 'root.deployment_settings' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'root.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtCookieAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})