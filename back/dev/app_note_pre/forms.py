import datetime
import urllib.parse

from django import forms as f
from django.core.files.storage import default_storage

from markdownx.fields import MarkdownxFormField

from app_note.models import NoteModel

class NoteEditForm( f.ModelForm ):
    update_head = f.CharField( required=False, )
    update_tag  = f.CharField( required=False, )
    update_text = f.CharField(
        widget  =f.Textarea(attrs={'rows': 100, 'cols': 40, 'style':'height:100%;'}),
        required=False,
    )
    class Meta:
        model  = NoteModel
        fields = ["update_text", "update_head", "update_tag"]
    def __init__(self, *args, **kwargs):
        super(NoteEditForm, self).__init__(*args, **kwargs)
