from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerailizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','password']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserListSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image_url']

    def get_profile_image_url(self, user):
        request = self.context.get('request')
        default = "/media/default.jpg"
        profile = getattr(user, 'profile', None)
        if profile and profile.image:
            url = profile.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        else:
            return request.build_absolute_uri(default)
        
        
class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at']
        
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username',
                  'sender_image_url', 'content', 'timestamp']

    def get_sender_image_url(self, obj):

        profile = getattr(obj.sender, 'profile', None)
        image = getattr(profile, 'image', None)
        if not image:
            return None

        url = getattr(image, 'url', None)
        if not url:
            return None

        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url

        
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    image_url = serializers.SerializerMethodField()
    remove_image = serializers.BooleanField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = ('username', 'email', 'image', 'image_url','remove_image')
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None
        

    def update(self, instance, validated_data):
        user = validated_data.pop('user', None)
        username = user['username']
        if username is not None:
            user = instance.user
            user.username = username
            user.save()
        
        if validated_data.pop('remove_image', False):
            if instance.image:
                instance.image.delete(save=False)
            instance.image = None

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance