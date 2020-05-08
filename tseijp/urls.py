from django.conf import settings
from django.urls import path, include
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
from backend.dev.init import note_init
router = routers.DefaultRouter()
router.register('note', NoteViewSet)
router.register('user', UserViewSet, basename="user")
#router.register('tags', TagsViewSet)

def note(request): return render(request, 'build/index.html')
def mdmd(request): return render(request, 'mdmd/build/index.html')
urlpatterns = [
    path('admin/', admin.site.urls     ),
    path('auth/' , obtain_auth_token   ),
    path('api/'  , include(router.urls)),
    # views
    path('note/' , note),
    path('mdmd/' , mdmd),
    ### dev
    path('note_init', note_init),
    ### coming soon
    #path('note/', note_view),

    #path('idea/'      , include('app_idea.urls')),
    #path('mesh/'      , include('app_mesh.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
