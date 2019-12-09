from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
SECRET_KEY='**************************************************'
<<<<<<< HEAD
DEBUG = False#True
=======
DEBUG         = False
>>>>>>> 051199563d432da716ed2fba74ea893199f811d3
ALLOWED_HOSTS = ['tsei.jp', '3.134.52.211', '3.134.52.211:8000']

# Database
DATABASES = {'default': {
    'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
    'NAME'    : 'tseijp',
    'USER'    : 'tseijp',
    'PASSWORD': 'django1234',
    'HOST'    : 'localhost',
    'PORT'    : ''}}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),)
