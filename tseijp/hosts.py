from django.conf import settings
from django_hosts import patterns, host

host_patterns = patterns('',
    host(r''    , settings.ROOT_URLCONF  , name='base'),
    host(r'note', 'app_note.urls'        , name='note'),
    host(r'code', 'app_idea.urls'        , name='code'),
)
