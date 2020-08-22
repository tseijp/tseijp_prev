from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, mixins
from rest_framework.status import HTTP_200_OK as status200
from rest_framework.status import HTTP_404_NOT_FOUND as status404
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
    mixins.RetrieveModelMixin, # for GET to tsei.jp/note/2/
    mixins.ListModelMixin    , # for GET to tsei.jp/note/
    mixins.CreateModelMixin  , # for POST to tsei.jp/note/
    viewsets.GenericViewSet  ,]
class NoteViewSet(*mymixin):#viewsets.ModelViewSet):
    queryset = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
    serializer_class = (NoteSerializer)
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    def retrieve(self, request, pk=None):
        try:
            children = self.get_object().get_children_id()
            queryset = NoteModel.objects.filter(id__in=children)
            return Response(self.get_serializer(queryset, many=True).data)
        except (NoteModel.DoesNotExist, KeyError):
             return Response({"error": "does not exist"}, status=status404)
    def create(self, request):
        res = self.post_note(request)
        if res: return Response(res, status=status200)
        else  : return Response({"error": "does not exist"}, status=status404)
    @action(detail=True, methods=['POST']) # for POST to tsei.jp/note/2/ajax/
    def ajax(self, request, pk=None):      # any change or delete for text, like, tags
        note = NoteModel.objects.get(id=pk)
        res  = {'message':'not working in ajax (%s)'%pk}
        res1 = self.post_note(request, note)
        res2 = self.post_like(request, note)
        res3 = self.delete_note(request, note)
        print([res,res1,res2,res3] )
        return Response([r for r in [res,res1,res2,res3] if r is not None][-1], status=status200)
    ########################## base ##########################
    def post_note(self, request, fields=[], note=None):
        fields = ['ja_text', 'en_text', 'note_object']
        if any([f in request.data for f in fields]):
            user = request.user
            data = request.data
            obj  = note if note else NoteModel.objects.create(posted_user=user)
            for field in fields:
                if field in data:
                    setattr(obj, field, data[field])
            obj.save()
            return NoteSerializer(obj).data
    def post_like(self, request, note):
        if 'like_object' in request.data:
            user = request.user
            objs= note.like_object.filter(posted_user=user)
            obj = objs[0] if objs else note.like_object.create(posted_user=user)
            obj.like_number = request.data['like_object']['like_number']
            obj.save()
            return NoteSerializer(note).data
    def delete_note(self, request, note):
        if 'delete_note' in request.data:
            if note.note_object is None: #main
                queryset = []
            else:
                children = [o.id for o in note.get_children(include_self=False)]
                queryset = NoteModel.objects.filter(id__in=children)
            if request.data['delete_note']:
                note.delete();
            return NoteSerializer(queryset, many=True).data
