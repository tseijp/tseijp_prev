from django.contrib  import admin
from app_mesh.models import *

# Register your models here.
for m in [MeshModel]:
    admin.site.register(m)
