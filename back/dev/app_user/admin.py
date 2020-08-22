from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

for m in [IndexJSONModel,IntroModel,IntroGridModel,IntroCardModel]:
    admin.site.register(m)
