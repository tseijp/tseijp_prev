from django.urls import path

### my create
from .views import home, test

urlpatterns = [
    path(''                  , home                    , name='idea'     ),
    path('home'              , home                    , name='note_home'     ),
    path('test'              , test                    , name='note_test'     ),
]
