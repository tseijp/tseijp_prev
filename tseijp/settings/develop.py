from .base import *

# """"""""""""""""""""""""" DEV SETTINGS """"""""""""""""""""""""" #
SECRET_KEY = '27-i4ny+76!c1+5soukzg72q!2zh^-9@@$h*hnfs=cv3lj*yi6'
DEBUG = True
ALLOWED_HOSTS = ['*', 'localhost', '192.168.0.112']
DATABASES = {'default': {
   #'ENGINE': 'django.db.backends.sqlite3',
   #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),}}
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
