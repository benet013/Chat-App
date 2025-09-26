# yourapp/middleware.py
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


def parse_cookies(cookie_header: bytes | None):
    if not cookie_header:
        return {}
    cookie_str = cookie_header.decode()
    cookies = {}
    for kv in cookie_str.split(";"):
        if "=" in kv:
            k, v = kv.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies


class JwtCookieAuthMiddleware:
    """
    Simple ASGI middleware that validates JWT (from cookie 'access' or ?token=...)
    and attaches the Django user object to scope['user'].
    This class returns an ASGI app instance which accepts (scope, receive, send).
    """

    def __init__(self, inner):
        # inner is the downstream ASGI app (usually URLRouter)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Only handle websocket connections here; pass-through other types
        if scope.get("type") != "websocket":
            return await self.inner(scope, receive, send)

        # read headers and querystring
        headers = dict(scope.get("headers", []))
        cookie_header = headers.get(b"cookie")
        token = None

        # try cookie first
        cookies = parse_cookies(cookie_header)
        token = cookies.get("access") or cookies.get("token") or None

        # fallback to ?token=...
        if not token:
            query_string = scope.get("query_string", b"").decode()
            params = parse_qs(query_string)
            token_list = params.get("token")
            if token_list:
                token = token_list[0]

        # validate token and set scope['user']
        if token:
            try:
                if getattr(settings, "SIMPLE_JWT", None):
                    signing_key = settings.SIMPLE_JWT.get("SIGNING_KEY", settings.SECRET_KEY)
                    algorithm = settings.SIMPLE_JWT.get("ALGORITHM", "HS256")
                else:
                    signing_key = settings.SECRET_KEY
                    algorithm = "HS256"

                backend = TokenBackend(signing_key=signing_key, algorithm=algorithm)
                validated = backend.decode(token, verify=True)
                user_id = validated.get("user_id") or validated.get("sub")
                if user_id:
                    scope["user"] = await get_user(user_id)
                else:
                    scope["user"] = AnonymousUser()
            except Exception as exc:
                print("JWT decode failed in Channels middleware:", exc)
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        # Call downstream app with modified scope
        return await self.inner(scope, receive, send)
