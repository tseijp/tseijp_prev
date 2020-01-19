from django.urls import path

### my create
from .views import *

urlpatterns = [
    path(''                  , MeshListView.as_view()  , name='mesh'     ),
    path('test'              , mesh_test               , name='mesh_test'),
    #path('edit')
    #path('delete')
]
