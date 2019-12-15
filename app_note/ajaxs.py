### Python
from googletrans import Translator
### Django
from django.http import JsonResponse### ajax
from django.utils import timezone
from django.contrib.auth.decorators import login_required

from app_note.models import NoteModel
from app_note.views import get_user

def note_list_ajax(request):
    dict ={"message":"Not working"}
    if request.GET:
        val = request.GET;
        note= NoteModel.objects.get(id=int(val["id"]))
        if not "%s"%val['user']=="%s"%request.user.id and note:#editor違ってnote存在
            obj = NoteModel.objects.create()
            obj.posted_user = note.posted_user
            obj.note_object = note
        else:obj = note
        #print(request.GET)
        #print(NoteModel.objects.get(id=int(val["id"])))
        #print("\tobj",note, note.posted_user, note.note_object)
        #print("\tobj",obj,  obj.posted_user , obj.note_object)
        if not obj.posted_user:obj.posted_user = get_user()
        if"tag" in val:obj.posted_tag =val['tag']
        if"img" in val:obj.posted_img =val['img']
        if "ja" in val['la']:
            if"head"in val:obj.ja_head=val['head']
            if"text"in val:obj.ja_text=val['text']
        if "en" in val['la']:
            if"head"in val:obj.en_head=val['head']
            if"text"in val:obj.en_text=val['text']
        obj.save()
        dict['note_id'     ] = "%s"%obj.id
        dict['note_user_id'] = "%s"%obj.posted_user.id
        #print(obj.posted_user)
        #print(dict)
    return JsonResponse(dict)

@login_required
def note_edit_ajax(request, pk):
    return_text = 'Not working'
    if request.GET:
        pass
    return JsonResponse({'result': return_text})
