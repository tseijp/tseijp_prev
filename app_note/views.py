from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
### my created
from .models      import NoteModel, TagsModel
from .serializers import NoteSerializer, TagsSerializer

'''
class TagsViewSet(viewsets.ModelViewSet):
    queryset = TagsModel.objects.all()
    #serializer_class = (TagSerializer)
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated, )
    def retrieve(self, request, *args, **kargs): #detail
        instance = Model.objects.filter(tags_object__id__contains=self.get_object().id)
        serializer = Serializer(instance, many=True)
        return Response(serializer.data)
'''
mymixin = [
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin    ,
    viewsets.GenericViewSet   ]
class NoteViewSet(*mymixin):#viewsets.ModelViewSet):
    queryset = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
    serializer_class = (NoteSerializer)
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    @action(detail=True, methods=['POST'])
    def ajax(self, request, pk=None):
        user = request.user
        note =  NoteModel.objects.get(id=pk)
        resp = {'message':'no ajax'}
        if 'like_object' in request.data:
            objs= note.like_object.filter(posted_user=user)
            obj = objs[0] if objs else note.like_object.create(posted_user=user)
            obj.like_number = request.data['like_object']['like_number']
            obj.save()
            resp = {'message':'new created like object'}
        return Response(resp, status=status.HTTP_200_OK)
