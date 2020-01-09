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

# Static files (CSS, JavaScript, Images)
INSTALLED_APPS += ['storages']

# STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

AWS_ACCESS_KEY_ID = 'AKIAR7LHZIYFUK4SNPU7'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'tseijp-static'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_LOCATION = 'static'
AWS_DEFAULT_ACL = None
STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
