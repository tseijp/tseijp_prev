# """"""""""""""" MY CREATED """"""""""""""" #
from back.models      import NoteModel
from back.paginations import NotePagination
from back.serializers import NoteSerializer
# """"""""""""""" REST """"""""""""""" #
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication

# """"""""""""""""""""""""" FOR NOTE """"""""""""""""""""""""" #
class NoteViewSet(GenericViewSet):
    ordering = "-id"
    queryset = NoteModel.objects.all()
    serializer_class = NoteSerializer
    pagination_class = NotePagination
    permission_classes = (AllowAny, )
    authentication_classes = (TokenAuthentication, )
    # """"""""""""""" """"""""" """"""""""""""" #
    # """"""""""""""" ORVERRIDE """"""""""""""" #
    # """"""""""""""" """"""""" """"""""""""""" #
    def get_paginated_response(self, data, request=None):
        assert self.paginator is not None
        print(request.build_absolute_uri())
        return Response({
            'isAuth'  : "HI", # TODO,
            'now'     : request.build_absolute_uri(),
            'next'    : self.paginator.get_next_link()     if data else None,
            'previous': self.paginator.get_previous_link() if data else None,
            'results' : data if data else "Page Not found.",
        }, status = 404 if data is None else 200)
    # """"""""""""""" FOR GET TO /api/note/ """"""""""""""" #
    def list(self, request, *args, **kwargs):
        page = self.paginate_queryset( self\
                   .filter_queryset( self.get_queryset() )
                   .filter(note_object__isnull=True) )
        if page is None:
            return self.get_paginated_response(None,  request=request)
        data = self.get_serializer(page, many=True,   request=request)
        return self.get_paginated_response(data.data, request=request)
    # """"""""""""""" FOR GET TO /api/note/xxx/ """"""""""""""" #
    def retrieve(self, request, pk):
        objs = self.filter_queryset(self.get_queryset())
        if str(pk).isdecimal():
            self.ordering = "id"
            reps = self.get_object().get_children_id()
            retr = objs.filter(id__in=reps)#.reverse()
        else:
            user = User.objects.filter(username=pk) or [None]
            retr = objs.filter(posted_user=user[0], note_object__isnull=True)
        page = self.paginate_queryset(retr) if retr else None
        if not page:
            return self.get_paginated_response(None , request=request)
        data = self.serializer_class(page, many=True, request=request)
        return self.get_paginated_response(data.data, request=request)

    ''' TODO : DEV (yyy(now ajax) to tags, like, note )
        WHEN : 9-1 ~ 9-2
    # """"""""""""""" FOR POST TO /note/ """"""""""""""" #
    def create(self, request):
        if request.user:
            res = self.post_note(request.data, request.user)
        if res:
            return Response(res, status=201)
        return Response({"error": "not exist"}, status=404)

    # """"""""""""""" FOR POST TO /api/note/xxx/yyy/ """"""""""""""" #
    @action(detail=True, methods=['POST'])
    def ajax(self, request, pk):
        if not request.user:
            return Response({"error": "not exist"}, status=404)
        note = self.queryset.get(id=pk)
        req  = dict(data=request.data, user=request.user, note=note)
        res0  = {'message':'not working in ajax (%s)'%pk}
        res1 = self.post_note(**req)
        res2 = self.post_like(**req)
        res3 = self.post_tags(**req)
        res3 = self.delete_note(**req)
        res  = [r for r in [res0,res1,res2,res3] if r is not None][-1]
        return Response(res, status=201)
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
