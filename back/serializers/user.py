from django.contrib.auth.models import User
from rest_framework import serializers as s
from rest_framework.authtoken.models import Token

# [ref](https://stackoverflow.com/questions/55766159/how-to-receive-username-with-token-by-django-rest-authetication)
class UserSerializer(s.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)

class MyCustomTokenSerializer(s.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Token
        fields = ('key', 'user')
