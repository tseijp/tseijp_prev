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
        print(request.GET)
        val = request.GET;
        note= NoteModel.objects.get(id=int(val["id"]))
        if not "%s"%val['user']=="%s"%request.user.id and note:#editor違ってnote存在
            obj = NoteModel.objects.create()
            obj.posted_user = note.posted_user
            obj.note_object = note
        else:obj = note
        print(NoteModel.objects.get(id=int(val["id"])))
        print("\tobj",note, note.posted_user, note.note_object)
        print("\tobj",obj,  obj.posted_user , obj.note_object)
        if not obj.posted_user:obj.posted_user = get_user()
        if"head"in val:obj.update_head=val['head']
        if"text"in val:obj.update_text=val['text']
        if"tag" in val:obj.update_tag =val['tag']
        if"img" in val:obj.update_tag =val['img']
        obj.save()
        if val['mode']=="posted":
            obj.posted_head = obj.update_head
            obj.posted_text = obj.update_text
            obj.posted_tag  = obj.update_tag
            obj.posted_img  = obj.update_img
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
        obj = NoteModel.objects.get(id=pk); print(request.POST)
        if request.user == obj.posted_user:
            if  'update_head'  in request.GET:
                obj.update_head = request.GET['update_head']
            if  'update_text'  in request.GET:
                obj.update_text = request.GET['update_text']
            if  'update_tag'   in request.GET:
                obj.update_tag  = request.GET['update_tag' ]
            if  'update_data'  in request.GET:
                obj.posted_head = obj.update_head
                obj.posted_text = obj.update_text
                obj.posted_tag  = obj.update_tag
            now = timezone.now()
            return_text = 'Auto Saved[{0}]({1}:{2})'.format(pk, now.hour, now.minute)
            obj.save()
    return JsonResponse({'result': return_text})

"""
@login_required
def note_list_ajax(request, *args, **kwargs):
    return_dict = {'message':'Not working'}
    note = Post.objects.get(id=kwargs['note_id'])
    user = User.objects.get(pk=int(request.GET['user']))
    if request.GET and note and user:
        if 'like' in request.GET:
            liked  = LikeModel.objects.filter(user=request.user).filter(note_object=note)
            if liked.count()<1:
                note.liked_num += 1
                obj            = LikedModel.objects.create()
                obj.note_object= note
                obj.posted_user= user
            else:
                note.liked_num -= 1
                liked.delete()
                return_dict['message']='delete your like'
        elif 'reply' in request.GET:
            note.replied_number += 1
            obj            = NoteModel.objects.create()
            obj.note_object= note
            obj.posted_user= user
            obj.save()
        elif 'delete': # delete reply
            replied= ReplyedModel.objects.filter(user=request.user).filter(note_object=note)
            replied.filter(pk=request.GET['reply_id']).delete()
            note.replied_number -= 1
            return_dict['message']='delete your reply'
        return JsonResponse(return_dict)
"""
"""
@login_required
def note_tool_ajax(request):
    return_text = 'Not working'
    if request.GET:
        tool_form = ToolForm(request.GET)
        if tool_form.is_valid():
            if  'translate_form'  in request.GET:
                translator = Translator()
                text1 = tool_form.data['translate_form']
                text2 = text1.replace('\n', ' ').replace('. ', '.\n').split('\n')
                text3 = [text2[i : i+3] for i in range(0,len(text2), 3)]
                text4 = ['\n'.join(t) for t in text3]
                text5 = ['\n<div class= "row"><div class="col-md-6">\n%s\n</div><div class="col-md-6">\n%s</div></div><br>\n'%(t, translator.translate(t, dest='ja').text) for t in text4]
                text6 =  '\n\n'.join(text5).replace('。', '.').replace('、', ',').replace('.  ', '.  \n').replace('\n', '  \n')
                return_text = text6
    return JsonResponse({'result': return_text})
"""
