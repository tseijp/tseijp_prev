from .base import *
from django.core.management.utils import get_random_secret_key
# """"""""""""""""""""""""" DEV SETTINGS """"""""""""""""""""""""" #
SECRET_KEY = get_random_secret_key()
DEBUG = True
ALLOWED_HOSTS = ['*', 'localhost', '192.168.0.112']
DATABASES = {'default': {
    'PASSWORD': 'django1234',
    'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
    'NAME'    : 'tseijp', 'HOST': 'localhost',
    'USER'    : 'tseijp', 'PORT': '5432',
}}

# """"""""""""""""""""""""" CORS SETTING """"""""""""""""""""""""" #
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE += ['corsheaders.middleware.CorsMiddleware',]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://192.168.0.112:3000'
)
