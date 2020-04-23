from django.urls import path, include
from django.contrib import admin
from rest_framework import routers
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

urlpatterns = [
    path('admin/', admin.site.urls     ),
    path('auth/' , obtain_auth_token   ),
    path('api/'  , include(router.urls)),
    ### dev
    path('note_init', note_init),

    ### coming soon
    #path('note/', note_view),

    #path('idea/'      , include('app_idea.urls')),
    #path('mesh/'      , include('app_mesh.urls')),
]# + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
