### python
from mistune import Markdown
import itertools
### django
from django.db import models as m
from django.urls import reverse_lazy
from django.utils import timezone
from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.models import User

# Create your views here.
from markdownx.utils import markdownify
from markdownx.models import MarkdownxField

class NoteModel(m.Model):
    note_object   = m.ForeignKey('self',on_delete=m.CASCADE, blank=True, null=True)
    posted_user   = m.ForeignKey(User,on_delete=m.CASCADE, blank=True, null=True)
    posted_time   = m.DateTimeField(default=timezone.now , blank=True, null=True)
    liked_number  = m.IntegerField(default=0             , blank=True, null=True)
    reply_number  = m.IntegerField(default=0             , blank=True, null=True)
    # posted
    posted_tag    = m.CharField(max_length=255           , blank=True, null=True)
    posted_img    = m.CharField(max_length=65535         , blank=True, null=True)
    posted_head   = m.CharField(max_length=255           , blank=True, null=True)
    posted_text   = m.TextField(max_length=65535         , blank=True, null=True)
    ### update
    update_tag    = m.CharField(max_length=255           , blank=True, null=True)
    update_img    = m.CharField(max_length=255           , blank=True, null=True)
    update_head   = m.CharField(max_length=255           , blank=True, null=True)
    update_text   = m.TextField (max_length=65535        , blank=True, null=True)
    ### liked_user    = m.ForeignKey(User, on_delete=m.CASCADE, null=True)
    def list_of_text(self)   :return self.posted_text.split('\n')
    def list_of_html(self)   :return markdownify(self.posted_text).split('\n')
    def text_to_html(self)   :return markdownify(self.posted_text)
    def posted_date (self)   :return self.posted_time.strftime('%d')
    def posted_month(self)   :return self.posted_time.strftime('%b')
    def posted_tag_list(self):return self.posted_tag.strip(' ').split('#')

    ### display
    def posted_frame_url(self,*args,**kwargs):return reverse_lazy('note_posted_frame',kwargs={'pk':self.pk})
    def update_frame_url(self,*args,**kwargs):return reverse_lazy('note_update_frame',kwargs={'pk':self.pk})
    def url_with_id    (self):return 'id=%s;'%self.pk
    def get_comment    (self):return NoteModel.objects.filter(Q(note_object=self))
    def get_child      (self):return [c for c in NoteModel.objects.filter(note_object=self)]
    def get_child_id   (self):return [c.id for c in self.get_child()]
    def get_child_child(self):return [c.get_child() for c in self.get_child()]
    def get_chichild_id(self):return list(itertools.chain.from_iterable([[c2.id for c2 in c] for c in self.get_child_child()]))
    def get_children_id(self):return [o.id for o in self.get_children()]
    def get_children(self, include_self=True):
        r = []
        if include_self:
            r.append(self)
        for c in NoteModel.objects.order_by('id').filter(note_object=self):
            _r = c.get_children(include_self=True)
            if 0 < len(_r):
                r.extend(_r)
        return r
    def img_is_url(self):return True if ("%s"%self.posted_img)[:4]=="http" else False

class LikeModel(m.Model):
    note_object   = m.ForeignKey('NoteModel',on_delete=m.CASCADE)
    posted_user   = m.ForeignKey(User,on_delete=m.CASCADE, blank=True, null=True)
    posted_time   = m.DateTimeField(default=timezone.now , blank=True, null=True)
