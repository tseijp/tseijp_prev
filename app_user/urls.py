from django.urls import path, include
from django.contrib.auth.views import  LoginView, LogoutView
### my create
from app_user.ajaxs import *
from app_user.views import *

urlpatterns = [
    path(''                  , home                    , name='home'         ),
    path('test'              , test                    , name='user_test'     ),
    path('code1'             , code1                   , name='user_code1'    ),
    path('json'              , index_json              , name='index_json'    ),
    ### User
    path('login' , LoginView.as_view()   ,   name='login'),
    path('logout', LogoutView.as_view()  ,   name='logout'),
    path('signup', SignupView.as_view()  ,   name='signup'),
    ### Intro
    path('<int:pk>'          , UserTopView.as_view()   , name='user_top'      ),
    path('<int:pk>/edit'     , UserEditView.as_view()  , name='user_edit'     ),
    path('<int:pk>/delete'   , UserDeleteView.as_view(), name='user_delete'   ),
    path('<int:pk>/edit/ajax', user_edit_ajax          , name='user_edit_ajax'),
    ### google auth
    #path('social/', include('social_django.urls', namespace='social')),
]
