from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView
from .serializers import UserSerailizer


class Register(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerailizer


