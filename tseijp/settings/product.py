from .base import *

# """"""""""""""""""""""""" PROD SETTINGS """"""""""""""""""""""""" #
DEBUG = False
SECRET_KEY = '**************************************************'
ALLOWED_HOSTS = ['tsei.jp', '3.134.52.211', '3.134.52.211:8000']
DATABASES = {'default': {
    'PASSWORD': 'django1234',
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'tseijp', 'HOST': 'localhost',
    'USER': 'tseijp', 'PORT': '',
}}
