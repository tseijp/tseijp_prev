import json

from django.core import serializers
from django.http import JsonResponse### ajax
from django.contrib.auth.models import User


import numpy as np
from app_user.models import *

def get_last_segs():
    last = IndexJSONModel.objects.filter(user__is_staff=True).order_by('-time')[0]#;print(last)
    return json.loads(last.segs)['segs']#[0] if last else []


def index_json(request):
    dict = {'return_text':'not working','json':[], 'last':[]}
    if request.GET:
        if'json'and'user' in request.GET:
            if request.GET['json']!='':
                obj     = IndexJSONModel.objects.create()
                obj.json= request.GET['json']
                obj.user= User.objects.get(pk=int(request.GET['user']))
                children= json.loads(request.GET['json'])[0][1]['children']
                obj.segs= json.dumps({'segs':[c[1]['segments'] for c in children if'segments'in c[1]]})
                obj.save()#; print(data)
                return JsonResponse(dict)
            paths = []
            for s in IndexJSONModel.objects.order_by('-time')[:5]:
                paths += json.loads(s.segs)['segs']#[0]#;print(s)
            dict['last'] = get_last_segs()
            dict['json'] = paths#;print(np.array(dict['last']).shape,np.array(dict['json']).shape,)
            return JsonResponse(dict)
    return JsonResponse(dict)


def user_edit_ajax(request, pk):
    return_text = 'Not working'
    if request.GET:
        obj = UserModel.objects.get(id=pk)
        if request.user == obj.posted_user:
            if  'update_head'  in request.GET:
                obj.update_head = request.GET['update_head']
            return_text = 'Auto Saved'
            obj.save()
    return JsonResponse({'result': return_text})

def intro_base_ajax(request, pk):
    if request.GET:
        obj = UserModel.objects.get(id=pk)
        if request.user == obj.posted_user:
            if'head'in request.GET: obj.head     = request.GET['head']
            if'word'in request.GET: obj.word     = request.GET['word']
            if'text'in request.GET: obj.text     = request.GET['text']
            if'link'in request.GET: obj.link     = request.GET['link']
            if'back'in request.GET: obj.back     = request.GET['back']
            obj.save()
            return obj
    return 0

def intro_card_ajax(request, pk):
    return_text = 'Not working'
    if intro_base_ajax():
        obj = intro_base_ajax(request, pk)
        if 'card_col' in request.GET: obj.card_col = request.GET['card_col']
        if 'pop_over' in request.GET: obj.pop_over = request.GET['pop_over']
        obj.save()
        return_text = 'Auto Saved'
    return JsonResponse({'result': return_text})
