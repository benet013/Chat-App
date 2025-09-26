from django.contrib.auth.models import User
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *


class Register(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerailizer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    try:
        user = User.objects.exclude(id=request.user.id)
        serializers = UserListSerializer(user, many=True)
        return Response(serializers.data,status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, pk):
    try:
        user = User.objects.get(id=pk)
        serializers = UserListSerializer(user)
        return Response(serializers.data,status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_id(request):
    try:
        user = request.user
        return Response({"id": user.id}, status=200)
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, pk):
    try:
        conversation = Conversation.objects.get(id=pk)
        if request.user not in conversation.participants.all():
            return Response({"status": "error", "message": "You are not a participant of this conversation"}, status=403)
        messages = conversation.messages.all()
        print(messages)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=200)
    except Conversation.DoesNotExist:
        return Response({"status": "error", "message": "Conversation does not exist"}, status=404)
    
class ConversationCreateIfNotExistsView(CreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        print(request.data)
        other_user_id = request.data.get('id')

        if not other_user_id:
            return Response({"status": "error", "message": "other_user_id is required"}, status=400)

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({"status": "error", "message": "User does not exist"}, status=404)

        # Check if a conversation already exists between the two users
        conversation = Conversation.objects.filter(participants=user).filter(participants=other_user).first()

        if conversation:
            serializer = self.serializer_class(conversation)
            return Response(serializer.data, status=200)

        # Create a new conversation
        conversation = Conversation.objects.create()
        conversation.participants.add(user, other_user)
        conversation.save()

        serializer = self.serializer_class(conversation)
        return Response(serializer.data, status=201)
    

