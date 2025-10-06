from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
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
        print("Message received from WebSocket:", text_data)
        text_data_json = json.loads(text_data)
        print("This is my data: ",text_data_json)
        
        message = text_data_json['message']
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
            await self.save_message(conversation, sender, message)
        
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'chat_message',
                    'message' : message,
                    'sender' : senderID
                }
            )
        
    async def chat_message(self,event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'type' : 'chat_message',
            'message': message,
            'sent' : sender
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