from .base import *

# """"""""""""""""""""""""" PROD SETTINGS """"""""""""""""""""""""" #
SECRET_KEY = '**************************************************'
DEBUG         = False
ALLOWED_HOSTS = ['tsei.jp', '3.134.52.211', '3.134.52.211:8000']
DATABASES = {'default': {
    'PASSWORD': 'django1234',
    'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
    'NAME': 'tseijp', 'HOST': 'localhost',
    'USER': 'tseijp', 'PORT': '',
}}
