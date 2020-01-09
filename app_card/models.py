
from django.db import models as m
from django.utils import timezone
from django.contrib.auth.models import User

### URL
from urllib.parse import urlparse
GOMAP_URL = ["maps.google.com"]
FBOOK_URL = ["facebook.com"]
INSTA_URL = ["instagram.com"]
SOUND_URL = ["soundcloud.com"]
TWEET_URL = ["twitter.com"]
UTUBE_URL = ["youtube.com"]
VIEMO_URL = ["player.vimeo.com"]

# Create your models here.

class CardModel(m.Model):
    posted_user   = m.ForeignKey(User,on_delete=m.CASCADE  , blank=True, null=True)
    posted_time   = m.DateTimeField(default=timezone.now   , blank=True, null=True)
    posted_data   = m.CharField(max_length=255             , blank=True, null=True)#img to url
    posted_link   = m.CharField(max_length=255             , blank=True, null=True)#url name
    #liked_number  = m.IntegerField(default=0               , blank=True, null=True)
    #reply_number  = m.IntegerField(default=0               , blank=True, null=True)
    ja_text= m.TextField(max_length=65535         , blank=True, null=True)
    en_text= m.TextField (max_length=65535        , blank=True, null=True)
    def get_sns      (self):return CardModel.objects.filter(card_object=self)
    def get_child    (self):return [c    for c in self.get_sns()]
    def get_child_id (self):return [c.id for c in self.get_child()]
    def get_child_num(self):return len( self.get_child() )

class CardSNSModel(m.Model):
    card_object   = m.ForeignKey('CardModel',on_delete=m.CASCADE)
    posted_user   = m.ForeignKey(User,on_delete=m.CASCADE, blank=True, null=True)
    posted_time   = m.DateTimeField(default=timezone.now , blank=True, null=True)
    posted_link   = m.CharField(max_length=255           , blank=True, null=True)
    def l_is_url(self):return True if ("%s"%self.posted_img)[:4]=="http" else False
    def l_is_fbo(self):return True if urlparse("%s"%self.posted_img).netloc in FBOOk_URL else False
    def l_is_ins(self):return True if urlparse("%s"%self.posted_img).netloc in INSTA_URL else False
    def l_is_twi(self):return True if urlparse("%s"%self.posted_img).netloc in TWEET_URL else False
    def l_is_utu(self):return True if urlparse("%s"%self.posted_img).netloc in UTUBE_URL else False
