import json
import numpy as np
### django
from django.db import models as m
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import ManyToManyField as M2MF

class TagsModel(m.Model):
    posted_user = m.ForeignKey(User,on_delete=m.CASCADE     ,blank=True,null=True)
    posted_time = m.DateTimeField(default=timezone.now      ,blank=True,null=True)
    posted_head = m.CharField (max_length=28                ,blank=True,null=True)

class LikeModel(m.Model):
    posted_user = m.ForeignKey(User,on_delete=m.CASCADE     ,blank=True,null=True)
    posted_time = m.DateTimeField(default=timezone.now      ,blank=True,null=True)
    like_number = m.CharField(max_length=28                 ,blank=True,null=True)

class NoteModel(m.Model):
    posted_user = m.ForeignKey(User,on_delete=m.CASCADE     ,blank=True,null=True)
    posted_time = m.DateTimeField(default=timezone.now      ,blank=True,null=True)
    ja_text     = m.TextField(max_length=65535, default=""  ,blank=True,null=True)
    en_text     = m.TextField(max_length=65535, default=""  ,blank=True,null=True)
    note_object = m.ForeignKey('self',on_delete=m.CASCADE   ,blank=True,null=True)
    tags_object = M2MF(TagsModel, related_name="note_object",blank=True)
    like_object = M2MF(LikeModel, related_name="note_object",blank=True)
    def posted_date (self):return self.posted_time.strftime('%d')
    def posted_month(self):return self.posted_time.strftime('%b')
    def like_mean   (self):return "%s"%np.mean([int(l.like_number) for l in self.like_object.all() if l.like_number.isdigit()])
    ### child
    def get_comment     (self):return NoteModel.objects.filter(Q(note_object=self))
    def get_child       (self):return [c for c in NoteModel.objects.filter(note_object=self)]
    def get_child_id    (self):return [c.id for c in self.get_child()]
    #def get_child_num   (self):return len( self.get_child() )
    #def get_child_child (self):return [c.get_child() for c in self.get_child()]
    #def get_chichil_arr (self):return [[c2.id for c2 in c] for c in self.get_child_child()]
    #def get_chichild_id (self):return list(itertools.chain.from_iterable(self.get_chichil_arr()))
    def get_children_id (self):return [o.id for o in self.get_children()]
    def get_children(self, include_self=True):
        r = []
        if include_self:
            r.append(self)
        for c in NoteModel.objects.order_by('id').filter(note_object=self):
            _r = c.get_children(include_self=True)
            if 0 < len(_r):
                r.extend(_r)
        return r
"""delete
    ### url
    def img_is_url  (self):return True if ("%s"%self.posted_img)[:4]=="http" else False
    def img_is_map  (self):return True if urlparse("%s"%self.posted_img).netloc in GOMAP_URL else False
    def img_is_movie(self):return True if urlparse("%s"%self.posted_img).netloc in MOVIE_URL else False
    def img_is_utube(self):return True if urlparse("%s"%self.posted_img).netloc in UTUBE_URL else False
    def img_is_viemo(self):return True if urlparse("%s"%self.posted_img).netloc in VIEMO_URL else False
    def img_is_sound(self):return True if urlparse("%s"%self.posted_img).netloc in SOUND_URL else False
    ### paper.js init path
    def get_json_objects(self):return NoteJSONModel.objects.filter(note_object=self).order_by('-posted_time')
    def get_eyes_objects(self):return self.get_json_objects().filter(posted_user=self.posted_user)
    def get_edit_objects(self):return self.get_json_objects().filter(posted_user=self.posted_user)
    def get_eyes_paths  (self):return get_paths(self.get_eyes_objects(), 5)
    def get_edit_paths  (self):return get_paths(self.get_edit_objects(), 1)

def get_paths(json_objects, num=1):
    paths = []
    for p in json_objects[:num]:
        if p.paper_segs:paths+=json.loads("%s"%p.paper_segs)['segs']
    return paths

class NoteJSONModel(m.Model):
    note_object = m.ForeignKey('NoteModel',on_delete=m.CASCADE)
    posted_user = m.ForeignKey(User, on_delete=m.CASCADE, blank=True, null=True)
    posted_time = m.DateTimeField(default=timezone.now  , blank=True, null=True)
    #paper_json  = JSONField(blank=True, null=True)
    paper_segs  = JSONField(blank=True, null=True)
    #def get_last(self):return self.objects.filter(Q(user__is_staff=True)).order_by('posted_time').last()
    #def get_segs(self):return json.loads(self.get_last().segs)['segs'][0] if self.get_last() else []
    def get_path(self):return json.loads("%s"%self.paper_segs)['segs']
"""
