from django.contrib  import admin
from app_card.models import *

# Register your models here.
for m in [CardModel]:
    admin.site.register(m)
