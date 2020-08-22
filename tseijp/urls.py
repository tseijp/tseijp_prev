from django.conf import settings
from django.urls import path, include, re_path
from django.contrib import admin
from rest_framework import routers
from django.shortcuts import render
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
### error
from backend.views import my_customized_server_error
from django.conf.urls import handler500
handler500 = my_customized_server_error

### my created
from backend.views import UserViewSet, NoteViewSet#, TagsViewSet

from backend.dev.init import register_notes
router = routers.SimpleRouter()
router.register('note', NoteViewSet)
router.register('user', UserViewSet, basename="user")
#router.register('tags', TagsViewSet)

def note      (request):return render(request, 'frontend/build/index.html')
def mdmd      (request):return render(request, 'mdmd/build/index.html')
def colo      (request):return render(request, 'colo/build/index.html')
def use_grid  (request):return render(request, 'use-grid/build/index.html')
def use_amazon(request):return render(request, 'use-amazon/build/index.html')
urlpatterns = [
    path('admin/', admin.site.urls     ),
    path('auth/' , obtain_auth_token   ),
    path('api/'  , include(router.urls)),
    path('register_notes', register_notes),
    # views
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
    re_path('mdmd', mdmd, name='mdmd'),
    re_path('colo', colo, name='colo'),
<<<<<<< HEAD
=======
    re_path('hook/use-grid'  , use_grid  , name='use_grid'),
>>>>>>> db7d929af8e5a080313ccf2b6504c34894696070
    re_path('hook/use-amazon', use_amazon, name='use_amazon'),
    re_path(''    , note, name='home'),
    #re_path(r'^$' , note),
    #re_path(r'^(?:.*)/?$', note)
    ### dev
    #path('idea/'      , include('app_idea.urls')),
    #path('mesh/'      , include('app_mesh.urls')),
]
