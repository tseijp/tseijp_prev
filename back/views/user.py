#from django.shortcuts import render
# """"""""""""""" REST """"""""""""""" #
from rest_framework import viewsets, mixins, status as STATUS
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

# """"""""""""""""""""""""" FOR USER """"""""""""""""""""""""" #
class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    #authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    def create(self, request):
        fields = ['password','username','email']
        status = STATUS.HTTP_500_INTERNAL_SERVER_ERROR
        data = request.data
        res = {'message':'not working'}
        if (all([data.get(f,None) for f in fields])) \
            and not data.get('username','').isdecimal():
            user = User( **{f:data[f] for f in ['username','email']} )
            user.set_password(data['password'])
            user.save()
            res = {"token":Token.objects.create(user=user).key}
            status = STATUS.HTTP_201_CREATED
        return Response(res, status=status)
