from django.contrib import admin
from .models import LikeModel, TagsModel, NoteModel

@admin.register(TagsModel)
class TagsModelAdmin(admin.ModelAdmin):
    list_display  = ['posted_head', 'posted_user', 'posted_time']
    search_fields = ['posted_head', 'posted_user', 'posted_time']

@admin.register(LikeModel)
class LikeModelAdmin(admin.ModelAdmin):
    list_display  = ['like_number', 'posted_user', 'posted_time']
    search_fields = ['like_number', 'posted_user', 'posted_time']

@admin.register(NoteModel)
class NoteModelAdmin(admin.ModelAdmin):
    list_display  = ['id', 'posted_user', 'posted_time',]
    search_fields = ['id', 'posted_user', 'posted_time',]
