import os


if "DJANGO_SETTINGS_MODULE" in os.environ:
    pass
else:
    if "RENDER_EXTERNAL_HOSTNAME" in os.environ or "RENDER" in os.environ:
        os.environ["DJANGO_SETTINGS_MODULE"] = "root.deployment_settings"
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "root.settings")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from user.route import websocket_urlpatterns
from user.middleware import JwtCookieAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtCookieAuthMiddleware(URLRouter(websocket_urlpatterns)),
})
