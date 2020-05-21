from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, mixins
################ status ###################
from rest_framework.status import HTTP_200_OK as status200
from rest_framework.status import HTTP_201_CREATED as status201
from rest_framework.status import HTTP_404_NOT_FOUND as status404
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR as status500
################ restfull ##################
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import make_password
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
################ my created ###################
from .models      import NoteModel, TagsModel
from .serializers import NoteSerializer, TagsSerializer, UserSerializer

class UserViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    #authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    def create(self, request):
        fields = ['password','username','email']
        status = status500
        data = request.data
        res = {'message':'not working'}
        if (all([data.get(f,None) for f in fields])) \
            and not data.get('username','').isdecimal():
            user = User( **{f:data[f] for f in ['username','email']} )
            user.set_password(data['password'])
            user.save()
            res = {"token":Token.objects.create(user=user).key}
            status = status201
        return Response(res, status=status)

class NoteViewSet(mixins.ListModelMixin,mixins.RetrieveModelMixin,mixins.CreateModelMixin,viewsets.GenericViewSet):
    queryset = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
    serializer_class = (NoteSerializer)
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    def list(self, request):################################ for GET to /note/
        objs = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
        data = NoteSerializer(objs, many=True, request_user=request.user)
        return Response(data.data, status=status200)
    def retrieve(self, request, pk):######################## for GET to /note/2/
        if str(pk).isdecimal():
            reps = self.get_object().get_children_id()
            objs = NoteModel.objects.filter(id__in=reps).order_by('id')
        else:
            user = User.objects.filter(username=pk)
            objs = NoteModel.objects.filter(posted_user=user[0])\
                    .filter(note_object__isnull=True).order_by('-id') if user else None
        if not objs:
            return Response("Not found", status=status404)
        data = NoteSerializer(objs, many=True, request_user=request.user)
        return Response(data.data, status=status200)
    def create(self, request):############################### for POST to /note/
        if request.user:
            res = self.post_note(request.data, request.user)
        if res:
            return Response(res, status=status201)
        return Response({"error": "not exist"}, status=status404)
    @action(detail=True, methods=['POST'])
    def ajax(self, request, pk):###################### for POST to /note/2/ajax/
        if not request.user:
            return Response({"error": "not exist"}, status=status404)
        note = NoteModel.objects.get(id=pk)
        req  = dict(data=request.data, user=request.user, note=note)
        res0  = {'message':'not working in ajax (%s)'%pk}
        res1 = self.post_note(**req)
        res2 = self.post_like(**req)
        res3 = self.post_tags(**req)
        res3 = self.delete_note(**req)
        res  = [r for r in [res0,res1,res2,res3] if r is not None][-1]
        return Response(res, status=status201)
    ########################## base ##########################
    def post_note(self, data, user, note=None):
        fields = ['ja_text', 'en_text', 'note_object', 'order_back']
        if any([f in data for f in fields]):
            objs = NoteModel.objects
            top  = objs.filter(id=data.get('note_object', None))
            obj  = note if note else objs.create(posted_user=user)
            if not note and top: obj.note_object = top[0]
            if 'ja_text'in data: obj.ja_text = data.get('ja_text')
            if 'en_text'in data: obj.en_text = data.get('en_text')
            obj.save()            #↓ if enter query, request_user is null
            return NoteSerializer([obj], many=True, request_user=user).data
    def post_like(self, data, user, note):
        if 'like_object' in data:
            objs= note.like_object.filter(posted_user=user)
            obj = objs[0] if objs else note.like_object.create(posted_user=user)
            obj.like_number = request.data.get('like_object',{}).get('like_number',0)
            obj.save()
            return NoteSerializer(note, many=False, request_user=user).data
    def post_tags(self, data,user, note):
        if 'tags_object' in data:
            objs = note.tags_object.filter(posted_user=user)
            obj = objs[0] if objs else note.tags_object.create(posted_user=user)
            obj.posted_head = request.data.get('tags_object',{}).get('posted_head','')
            obj.save()
    def delete_note(self, data, user, note):
        if data.get('delete_note',False):# and user==note.posted_user:
            note.delete();
            return {'message':"deleted"}

###################### error ######################
webhook_url = 'https://hooks.slack.com/services/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'
cat_iframes = [
    '<iframe src="https://giphy.com/embed/JIX9t2j0ZTN9S" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/JIX9t2j0ZTN9S">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/VbnUQpnihPSIgIXuZv" width="384" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/computer-cat-wearing-glasses-VbnUQpnihPSIgIXuZv">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/jRlP4zbERYW5HoCLvX" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jRlP4zbERYW5HoCLvX">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/33OrjzUFwkwEg" width="435" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-33OrjzUFwkwEg">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/UZzuqeBeRcD3W" width="480" height="346" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/dance-dancing-cat-UZzuqeBeRcD3W">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/6bAZXey5wNzBC" width="480" height="336" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-kitty-funny-6bAZXey5wNzBC">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/uZxa6mNaSihVu" width="480" height="272" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-funny-uZxa6mNaSihVu">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/CCK9EUDEIe2sw" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-everybody-CCK9EUDEIe2sw">via GIPHY</a></p>',
]
def get_cat_iframe():
    import random
    return random.choices(cat_iframes)[0]

### error
from django.http import HttpResponseServerError
from django.views.decorators.csrf import requires_csrf_token
@requires_csrf_token
def my_customized_server_error(request, template_name='500.html'):
    import json
    import requests
    import traceback
    requests.post(
        webhook_url,
        data=json.dumps({
            'text': '\n'.join([
                f'Request uri: {request.build_absolute_uri()}',
                traceback.format_exc(),
            ]),
            'username': 'Django Server Error 500',
            'icon_emoji': ':jack_o_lantern:',
        })
    )
    message  = '<h1>Server Error (500)</h1>'
    message += '<h5>t1810394@edu.cc.uec.ac.jp</h5>'
    message += get_cat_iframe()
    return HttpResponseServerError(message)
