from .base import *

# CORS
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE += ['corsheaders.middleware.CorsMiddleware',]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://192.168.0.112:3000'
)


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '27-i4ny+76!c1+5soukzg72q!2zh^-9@@$h*hnfs=cv3lj*yi6'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ALLOWED_HOSTS = ['*']

# Database
DATABASES = {'default': {
    #'ENGINE': 'django.db.backends.sqlite3',
    #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),}}
    'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
    'NAME'    : 'tseijp',
    'USER'    : 'tseijp',
    'PASSWORD': 'django1234',
    'HOST'    : 'localhost',
    'PORT'    : '5432'}}
