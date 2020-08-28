# """"""""""""""" MY CREATED """"""""""""""" #
from back.models      import NoteModel
from back.paginations import NotePagination
from back.serializers import NoteSerializer
# """"""""""""""" REST """"""""""""""" #
from rest_framework import viewsets, mixins, status as STATUS
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication

# """"""""""""""""""""""""" FOR NOTE """"""""""""""""""""""""" #
class NoteViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet
):
    queryset = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
    serializer_class = (NoteSerializer)
    authentication_classes = (TokenAuthentication, )
    permission_classes = (AllowAny, )
    # """"""""""""""" FOR GET TO /note/ """"""""""""""" #
    def list(self, request):
        objs = NoteModel.objects.filter(note_object__isnull=True).order_by('-id')
        data = NoteSerializer(objs, many=True, request_user=request.user)
        return Response(data.data, status=STATUS.HTTP_200_OK)
    # """"""""""""""" FOR GET TO /note/xxx/ """"""""""""""" #
    def retrieve(self, request, pk):
        if str(pk).isdecimal():
            reps = self.get_object().get_children_id()
            objs = NoteModel.objects.filter(id__in=reps).order_by('id')
        else:
            user = User.objects.filter(username=pk)
            objs = NoteModel.objects.filter(posted_user=user[0])\
                    .filter(note_object__isnull=True).order_by('-id') if user else None
        if not objs:
            return Response("Not found", status=STATUS.HTTP_404_NOT_FOUND)
        data = NoteSerializer(objs, many=True, request_user=request.user)
        return Response(data.data, status=STATUS.HTTP_200_OK)
    # """"""""""""""" FOR POST TO /note/ """"""""""""""" #
    def create(self, request):
        if request.user:
            res = self.post_note(request.data, request.user)
        if res:
            return Response(res, status=STATUS.HTTP_201_CREATED)
        return Response({"error": "not exist"}, status=STATUS.HTTP_404_NOT_FOUND)
    # """"""""""""""" FOR POST TO /note/2/ajax/ """"""""""""""" #
    @action(detail=True, methods=['POST'])
    def ajax(self, request, pk):
        if not request.user:
            return Response({"error": "not exist"}, status=STATUS.HTTP_404_NOT_FOUND)
        note = NoteModel.objects.get(id=pk)
        req  = dict(data=request.data, user=request.user, note=note)
        res0  = {'message':'not working in ajax (%s)'%pk}
        res1 = self.post_note(**req)
        res2 = self.post_like(**req)
        res3 = self.post_tags(**req)
        res3 = self.delete_note(**req)
        res  = [r for r in [res0,res1,res2,res3] if r is not None][-1]
        return Response(res, status=STATUS.HTTP_201_CREATED)
    '''
    # """"""""""""""" POST """"""""""""""" #
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
    # """"""""""""""" DEV """"""""""""""" #
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
    '''
