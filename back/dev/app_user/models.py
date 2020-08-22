### python
### django
from django.db import models as m
from django.utils import timezone
from django.core.validators import URLValidator
from django.contrib.postgres import fields as f
from django.contrib.auth.models import User

from django.core import serializers
from jsonfield   import JSONField


class IndexJSONModel(m.Model):
    user     = m.ForeignKey(User, on_delete=m.CASCADE, blank=True, null=True)
    time     = m.DateTimeField(default=timezone.now  , blank=True, null=True)
    json     = JSONField(blank=True, null=True)
    segs     = JSONField(blank=True, null=True)
    def get_last(self):return self.objects.filter(Q(user__is_staff=True)).order_by('time').last()
    def get_segs(self):return json.loads(self.get_last().segs)['segs'][0] if self.get_last() else []

class IntroModel(m.Model):
    user     = m.ForeignKey(User, on_delete=m.CASCADE)
    time     = m.DateTimeField(default=timezone.now  , blank=True, null=True)
    head     = m.CharField(max_length=255            , blank=True, null=True)
    text     = m.TextField(max_length=255            , blank=True, null=True)

class IntroBaseModel(m.Model):
    intro  = m.ForeignKey(IntroModel                 , on_delete=m.CASCADE)
    head   = m.CharField(max_length=255              , blank=True, null=True)
    word   = m.CharField(max_length=255              , blank=True, null=True)
    text   = m.TextField(max_length=255              , blank=True, null=True)
    link   = m.TextField(validators=[URLValidator()] , blank=True, null=True)
    back   = m.TextField(validators=[URLValidator()] , blank=True, null=True)

class IntroCardModel(IntroBaseModel):
    card_col = m.IntegerField(default=6               , blank=True, null=True)
    pop_over = m.TextField(max_length=255             , blank=True, null=True)

class IntroGridModel(IntroBaseModel):
    design   = m.IntegerField(default=1               , blank=True, null=True)
    note_url = m.TextField(validators=[URLValidator()], blank=True, null=True)
    note_qty = m.IntegerField(default=0               , blank=True, null=True)
