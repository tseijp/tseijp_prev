from django.contrib import admin
from .models import *

for m in [NoteModel, LikeModel, NoteJSONModel]:
    admin.site.register(m)
