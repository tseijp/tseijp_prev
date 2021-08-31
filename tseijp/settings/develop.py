from .base import *
from django.core.management.utils import get_random_secret_key
# """"""""""""""""""""""""" DEV SETTINGS """"""""""""""""""""""""" #
DEBUG = True
SECRET_KEY = get_random_secret_key()
ALLOWED_HOSTS = ['*', 'localhost', '192.168.0.112']
DATABASES = {'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': osp.join(BASE_DIR, 'db.sqlite3'),
}}


# """"""""""""""""""""""""" CORS SETTING """"""""""""""""""""""""" #
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE += ['corsheaders.middleware.CorsMiddleware']
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://192.168.0.112:3000'
)
