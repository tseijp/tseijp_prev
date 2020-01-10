from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
SECRET_KEY='**************************************************'
DEBUG         = False
ALLOWED_HOSTS = ['tsei.jp', '3.134.52.211', '3.134.52.211:8000']

# Database
DATABASES = {'default': {
    'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
    'NAME'    : 'tseijp',
    'USER'    : 'tseijp',
    'PASSWORD': 'django1234',
    'HOST'    : 'localhost',
    'PORT'    : ''}}

# Static files (CSS, JavaScript, Images) -------------------------------------
### [ref:Django staticファイルとAWS S3 - Qiita](https://qiita.com/sand/items/2eae781e2b904e0e67b9)
INSTALLED_APPS+=['storages']

#STATIC_URL = '/static/'
#STATIC_ROOT = os.path.join(BASE_DIR, 'static')

### AWS SETTINGS
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = 'AKIAR7LHZIYFUK4SNPU7'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'tseijp-static'

STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
STATIC_URL = 'http://' + AWS_STORAGE_BUCKET_NAME + '.s3.amazonaws.com/'
ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'
