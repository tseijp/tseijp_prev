from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import NoteModel, TagsModel, LikeModel
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
    class Meta:
        model = NoteModel
        fields = ['id','posted_user','posted_time', 'like_object','tags_object','like_mean']
