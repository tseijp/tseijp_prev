from django.contrib import admin
from.models import *

for m in [NoteModel, LikeModel]:
    admin.site.register(m)
