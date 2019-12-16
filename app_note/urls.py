from django.urls import path

### my create
from app_note.views import *
from app_note.ajaxs import *

urlpatterns = [
    #path('test'              , qiita_init              , name='note_test'     ),
    #path('drop'              , drop_all              , name='note_drop'     ),
    path(''                  , NoteHomeView.as_view()  , name='note'          ),
    #path('<int:pk>'          , NoteDetailView.as_view(), name='note_detail'   ),
    #path('note_list_ajax/<int:pk>', note_list_ajax     , name='note_list_ajax'     ),
    path('note_list_ajax'    , note_list_ajax          , name='note_list_ajax'),
    #path('note_edit_ajax/<int:pk>', note_edit_ajax     , name='note_edit_ajax'),
    #path('note_tool_ajax/ajax'    , note_tool_ajax     , name='note_tool_ajax'),

    #path('edit/<int:pk>'     , NoteEditView.as_view()  , name='note_edit'     ),
    path('delete/<int:pk>'   , NoteDeleteView.as_view(), name='note_delete'   ),
#    path('posted/raw/<int:pk>'   , NotePostedRawView.as_view()   , name='note_posted_raw'  ),
#    path('update/raw/<int:pk>'   , NoteUpdateRawView.as_view()   , name='note_update_raw'  ),
    path('ja/<int:pk>' , NoteJaView.as_view() , name='note_ja'),
    path('en/<int:pk>' , NoteEnView.as_view() , name='note_en'),
]
