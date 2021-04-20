# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
# """"""""""""""""""""""""" url.py """"""""""""""""""""""""" #
# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
import os
import os.path as osp
from django.conf import settings
from django.urls import path, re_path
from django.contrib import admin
# from rest_framework import routers
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from rest_framework.authtoken.views import obtain_auth_token
# """"""""""""""" MY CREATED """"""""""""""" #
from .utils import my_customized_server_error
from note.urls import urlpatterns as note_urlpatterns
from django.conf.urls import handler500
handler500 = my_customized_server_error

static_dir = 'tseijp/static/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', obtain_auth_token),
    # *note_urlpatterns,
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
]

submodules = [s for s in os.listdir() if osp.isfile("%s%s/index.html" % (static_dir, s))]
submodules = sorted(submodules, key=lambda v: v == "core")

for name in submodules:
    route = name if name != "core" else ""
    temp = '%s%s/index.html' % (static_dir, name)
    view = TemplateView.as_view(template_name=temp)
    urlpatterns += [re_path(route, view, name=name)]
