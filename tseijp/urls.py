# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
# """"""""""""""""""""""""" url.py """"""""""""""""""""""""" #
# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
import os
import os.path as osp
from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from rest_framework import routers
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from rest_framework.authtoken.views import obtain_auth_token
# """"""""""""""" MY CREATED """"""""""""""" #
from back.dev import register
from back.views import UserViewSet, NoteViewSet

# """"""""""""""" ERROR """"""""""""""" #
from back.views import my_customized_server_error
from django.conf.urls import handler500

handler500 = my_customized_server_error
router = routers.SimpleRouter()
router.register(r'note', NoteViewSet)
router.register(r'user', UserViewSet, basename="user")
submodules = [s for s in os.listdir() if osp.isdir("%s/build/%s" % (s, s))]
submodules = sorted(submodules, key=lambda v: v == "core")
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', obtain_auth_token),
    path('api/', include(router.urls)),
    path('register', register),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
]

for name in submodules:
    route = name if name != "core" else ""
    temp = 'tseijp/static/%s/index.html' % name
    view = TemplateView.as_view(template_name=temp)
    urlpatterns += [re_path(route, view, name=name)]

# from importlib import import_module
# for i, app in enumerate(submodules):
#     views_name = app + ".views"
#     views_lib = import_module(views_name)
#     for name, cls in views_lib.__dict__.items():
#         if name.lower() == "fromdirview":
#             url = "%s/" % (i+1) + cls.url()
#             urlpatterns += [path(url, cls.as_view())]
