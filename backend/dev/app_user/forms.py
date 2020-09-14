# Python --------------------------------------------
import datetime
import urllib.parse
# Django --------------------------------------------
from django import forms
from django.core.files.storage import default_storage
# my created ----------------------------------------
from app_user.models import IntroModel
# ---------------------------------------------------

class IntroForm( forms.ModelForm ):
    head = forms.CharField( required=False, )
    word = forms.CharField( required=False, )
    text = forms.CharField(
        widget  =forms.Textarea(attrs={'rows': 30, 'cols': 40, 'class':'ham'}),
        required=False,
    )
    class Meta:
        model  = IntroModel
        fields = ["head", "word", "text"]
    def __init__(self, *args, **kwargs):
        super(IntroForm, self).__init__(*args, **kwargs)
