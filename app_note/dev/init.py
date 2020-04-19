from django.contrib.auth.decorators import login_required

from app_note.models import NoteModel
from .note import note

def register_note(id, note, user):
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
def note_init(request):
    NoteModel.objects.all().delete()
    user = request.user
    id = None
    for n in note:
        id = register_note(id, n, user)
