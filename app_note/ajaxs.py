### Python
import difflib
from googletrans import Translator
### Django
from django.http import JsonResponse### ajax
from django.utils import timezone
from django.contrib.auth.decorators import login_required
### my created
from app_note.models import *
from app_note.views  import get_user

def posted_ajax(request, get, note):
    dict ={"message":"Not working"}
    if not "%s"%get['user']=="%s"%request.user.id and note:#editor違ってnote存在
        obj = NoteModel.objects.create()
        obj.posted_user = note.posted_user
        obj.note_object = note
    else:obj = note
    if not obj.posted_user:obj.posted_user = get_user()
    if"tag" in get:obj.posted_tag =get['tag']
    if"img" in get:obj.posted_img =get['img']
    if "ja" in get['la']:
        if"head"in get:obj.ja_head=get['head']
        if"text"in get:obj.ja_text=get['text']
    if "en" in get['la']:
        if"head"in get:obj.en_head=get['head']
        if"text"in get:obj.en_text=get['text']
    obj.save()
    dict['note_id'     ] = "%s"%obj.id
    dict['note_user_id'] = "%s"%obj.posted_user.id
    return dict

def liked_ajax(request, get, note):
    dict ={"message":"Not working"}
    if note :#and not "%s"%get['user']=="%s"%request.user.id:#editor違ってnote存在
        note_like = LikeModel.objects.filter(note_object=note).order_by('-id')
        try   :user_id = request.user.id
        except:user_id=None
        if not user_id in [l.posted_user.id for l in note_like] or not request.user:
            #print('you are not in database of this note and there is note')
            obj = LikeModel.objects.create(note_object=note)
            obj.posted_user = get_user(request.user.id)
            obj.save()
            note.liked_number+=1
            dict['result'] = 'new like'
        else:
            note_like.filter(posted_user=request.user).delete()
            note.liked_number-=1
            dict['result'] = 'delete like'
        note.save()
        dict['liked_number'] = note.liked_number
        #print(dict['result'], "\t", dict['liked_number'])
    return dict

def ret_ajax(request, get, note):
    dict ={"message":"Not working"}
    if note and get['ret']:
        translator = Translator()
        text0 = get['ret']
        text1 = text0.replace(',','、').replace('.','。').replace('\n','').replace(' ','')
        text2 = translator.translate(text1, dest='en').text
        text3 = translator.translate(text2, dest='ja').text
        text4 = text3.replace('.','.\n').replace('。', '. \n',).replace('、', ', ')
        ratio = difflib.SequenceMatcher(None, text1, text3).ratio()
        assss= [r[2] for r in[[0.9,9,'秀'],[0.8,0.9,'優'],[0.7,0.8,'良'],[0.6,0.7,'可'],[-9,0.6,'不可']]if r[0]<ratio<r[1]][0]
        dict['retja'] =text4
        dict['reten'] =text2
        dict['ratio'] =ratio if text2 else 'Copy here!!'
        dict['assss'] =assss
    return dict

def note_list_ajax(request):
    dict={}
    if request.GET:
        get = request.GET;
        note= NoteModel.objects.get(id=int(get["id"]))
        #print('get',get)
        #print('note',note)
        if   get['mode']=="posted":dict = posted_ajax(request, get, note)
        elif get['mode']=="liked" :dict = liked_ajax(request, get, note)
        elif get['mode']=="ret"   :dict = ret_ajax(request, get, note)
        #print('dict',dict)
    return JsonResponse(dict)













### not used ------------------------------------------------------------------
@login_required
def note_edit_ajax(request, pk):
    return_text = 'Not working'
    if request.GET:
        pass
    return JsonResponse({'result': return_text})
