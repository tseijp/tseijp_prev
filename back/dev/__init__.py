from .note import notes
from django.http import HttpResponseRedirect
from back.models import NoteModel
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

def create(note, user, id, parent):
    obj = NoteModel.objects.create(pk=id)
    obj.id = id
    obj.ja_text = note
    obj.en_text = "TODO"#note
    obj.posted_user = user
    if (parent!=id):
        obj.note_object = NoteModel.objects.get(id=parent)
    obj.save()
    print('%s%s\t%s'%(''
        if parent==id
        else '\t%s-'%parent,
        id, '%s ...'%(note[:10].replace('\n','\t'))
    ))

@login_required
def register(request):
    NoteModel.objects.all().delete()
    user = request.user
    id = 1
    parent = id
    for note in notes:
        if (note):
            create(note, user, id, parent)
            id += 1
        else:
            parent = id
    return HttpResponseRedirect('/note')

# """"""""""""""""""""""""" PREV """"""""""""""""""""""""" #
'''
def create(id, note, user):
    objs = NoteModel.objects
    obj = objs.create()
    obj.posted_user = user
    #obj.posted_time = note['posted_time']
    obj.ja_text = note['ja_text']
    obj.en_text = ''
    if note['note_object'] is None:
        obj.save()
        print(id)
        return obj.id
    else:
        obj.note_object = objs.get(id=id)
        obj.save()
        return id

@login_required
def register_note(request):
    NoteModel.objects.all().delete()
    user = request.user
    id = None
    for n in note:
        id = register_note(id, n, user)
    return HttpResponseRedirect('/')
'''
