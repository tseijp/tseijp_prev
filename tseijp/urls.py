# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
# """"""""""""""""""""""""" url.py """"""""""""""""""""""""" #
# """"""""""""""""""""""""" """""" """"""""""""""""""""""""" #
from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from rest_framework import routers
from django.shortcuts import render
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
# """"""""""""""" ERROR """"""""""""""" #
from back.views import my_customized_server_error
from django.conf.urls import handler500
handler500 = my_customized_server_error

# """"""""""""""" MY CREATED """"""""""""""" #
from back.dev import register
from back.views import UserViewSet, NoteViewSet#, TagsViewSet
router = routers.SimpleRouter()
router.register(r'note', NoteViewSet)
router.register(r'user', UserViewSet, basename="user")

# """"""""""""""""""""""""" ROUTING """"""""""""""""""""""""" #
def core      (request):return render(request, 'core/build/index.html')
def mdmd      (request):return render(request, 'mdmd/build/index.html')
def colo      (request):return render(request, 'colo/build/index.html')
def use_grid  (request):return render(request, 'hook/use-grid/build/index.html')
def use_amazon(request):return render(request, 'hook/use-amazon/build/index.html')

# """"""""""""""""""""""""" URL """"""""""""""""""""""""" #
urlpatterns = [
    path('admin/', admin.site.urls     ),
    path('auth/' , obtain_auth_token   ),
    path('api/'  , include(router.urls)),
    path('register', register),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    re_path('hook/use-amazon', use_amazon, name='use_amazon'),
    re_path('hook/use-grid'  , use_grid  , name='use_grid'),
    re_path('mdmd', mdmd, name='mdmd'),
    re_path('colo', colo, name='colo'),
    re_path(''    , core, name='home'),
]
