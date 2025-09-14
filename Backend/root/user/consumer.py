from channels.generic.websocket import AsyncWebsocketConsumer

class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection established.")
        await self.accept()