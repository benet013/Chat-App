import os

if "DJANGO_SETTINGS_MODULE" not in os.environ:
    if "RENDER_EXTERNAL_HOSTNAME" in os.environ or "RENDER" in os.environ:
        os.environ["DJANGO_SETTINGS_MODULE"] = "root.deployment_settings"
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "root.settings")

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter

django_asgi_app = get_asgi_application()

from channels.routing import URLRouter
from user.route import websocket_urlpatterns
from user.middleware import JwtCookieAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JwtCookieAuthMiddleware(URLRouter(websocket_urlpatterns)),
})
