from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import NoteModel, TagsModel, LikeModel

# [ref](https://stackoverflow.com/questions/55766159/how-to-receive-username-with-token-by-django-rest-authetication)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)

class MyCustomTokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Token
        fields = ('key', 'user')

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TagsModel
        fields = ['id', 'posted_user', 'posted_time', 'posted_head']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LikeModel
        fields = ['id', 'posted_user', 'posted_time', 'like_number']

class NoteSerializer(serializers.ModelSerializer):
    tags_object = TagsSerializer(many=True)
    like_object = LikeSerializer(many=True)
    posted_user = UserSerializer(many=False)
    request_user = serializers.SerializerMethodField()
    like_mean = serializers.SerializerMethodField()
    def __init__(self, *args, **kwargs):
        self.request = dict( user=kwargs.pop('request_user', None) )
        super().__init__()
    def get_request_user(self, obj):
        return UserSerializer(self.request['user']).data
    def get_like_mean(self, obj):
        like_objs = [l for l in obj.like_object.all()]
        like_nums = [int(l) for l in like_objs if l.like_number.isdigit()]
        return ( sum(like_nums) / len(like_nums) ) if like_nums else 0
    class Meta:
        model = NoteModel
        fields = "__all__"
        extra_fields = ['request_user', 'like_mean']
