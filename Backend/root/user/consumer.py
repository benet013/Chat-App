from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Profile
import json


class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection established.")

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        print("Room group name:", self.room_group_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        user = self.scope['user']
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'online_status',
                'user' : user.username,
                'status' : 'online',
            }
        )
        
    async def disconnect(self, close_code):
        user = self.scope['user']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'online_status',
                'user' : user.username,
                'status' : 'offline',
            }
        )
        
        print("WebSocket connection closed.")
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        senderID = self.scope['user'].id
        conversationID = self.room_name.split("_")[-1]
        conversation = await self.get_conversation(conversationID)
        sender = await self.get_user(senderID)
        
        if text_data_json.get('type') == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'typing',
                    'user' : senderID
                }
            )

        if text_data_json.get('type') == 'chat_message':
            message = text_data_json['message']
            
            await self.save_message(conversation, sender, message)
            
            sender_image_url = await self.get_sender_image_url(senderID)
                    
            print(sender_image_url)
        
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'chat_message',
                    'message' : message,
                    'sender' : senderID,
                    'image' : sender_image_url
                }
            )
        
    async def chat_message(self,event):
        message = event['message']
        sender = event['sender']
        image = event['image']

        await self.send(text_data=json.dumps({
            'type' : 'chat_message',
            'message': message,
            'sent' : sender,
            'image': image
        }))
        
    async def online_status(self, event):
        await self.send(text_data=json.dumps({
            'type' : 'online_status',
            'user' : event['user'],
            'status' : event['status']
        }))
        
    async def typing(self, event):
        user = event['user']
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'user': user,
        }))
        
    @database_sync_to_async
    def get_conversation(self, room_name):
        from .models import Conversation
        try:
            conversation = Conversation.objects.get(id=room_name)
            return conversation
        except Conversation.DoesNotExist:
            print("Conversation does not exist.")
            return None
        
    @database_sync_to_async
    def save_message(self, conversation, sender, message):
        from .models import Message
        msg = Message.objects.create(
            conversation = conversation,
            sender = sender,
            content = message
        )
        msg.save()
        return msg
    
    @database_sync_to_async
    def get_user(self, id):
        from django.contrib.auth import get_user_model
        user = get_user_model()
        return user.objects.get(id=id)
    
    @database_sync_to_async
    def get_messages(self, conversation):
        if conversation:
            return conversation.messages.all().order_by('timestamp')
        return []
    
    @database_sync_to_async
    def get_sender_image_url(self, user_id):
        user = get_user_model()
        user = user.objects.select_related('profile').get(id=user_id)
        Profile.objects.get_or_create(user=user) 

        img = getattr(user.profile, "image", None)
        return img.url if img else None