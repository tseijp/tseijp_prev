from django.urls import path

### my create
from .views import *

urlpatterns = [
    path(''                  , CardListView.as_view()  , name='card'     ),
    path('test'              , test                    , name='card_test'),
    #path('edit')
    #path('delete')
]
