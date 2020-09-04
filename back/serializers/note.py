from django.contrib.auth.models import User
from rest_framework import serializers as s
from rest_framework.authtoken.models import Token
from back.models import NoteModel, TagsModel, LikeModel
from .user import UserSerializer

class TagsSerializer(s.ModelSerializer):
    class Meta:
        model  = TagsModel
        fields = ['id', 'posted_user', 'posted_time', 'posted_head']

class LikeSerializer(s.ModelSerializer):
    class Meta:
        model  = LikeModel
        fields = ['id', 'posted_user', 'posted_time', 'like_number']

class NoteSerializer(s.ModelSerializer):
#   like_mean   = s.SerializerMethodField()
    is_author   = s.SerializerMethodField()
    author_name = s.SerializerMethodField()
#   tags_object = TagsSerializer(many=True)
#   like_object = LikeSerializer(many=True)
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super().__init__()
    def get_is_author(self, obj):
        user = self.request and self.request.user
        return user and user.id == obj.posted_user.id
    def get_author_name(self, obj):
        return obj.posted_user.username
#   TODO : tags and likes
#   def get_like_mean(self, obj):
#       like_objs = [l for l in obj.like_object.all()]
#       like_nums = [int(l) for l in like_objs if l.like_number.isdigit()]
#       return ( sum(like_nums) / len(like_nums) ) if like_nums else Non
    class Meta:
        model = NoteModel
        fields = ["id", "ja_text", "en_text"]\
               + ["is_author", "author_name"]\
               + ["posted_time"]
        # fields = "__all__"
        # extra_fields = ['request_user', 'like_mean']
