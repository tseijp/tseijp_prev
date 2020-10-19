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

# """"""""""""""""""""""""" SOCIAL AUTH SETTING """"""""""""""""""""""""" #
###  sosial auth signup with google
###  [ref](https://qiita.com/moi1990sk/items/a849fca7acb29db95508)
TEMPLATES[0]['OPTIONS']['context_processors'] += [
    'social_django.context_processors.backends',       # <- #  signup with google
    'social_django.context_processors.login_redirect', # <- #  signup with google
]
AUTHENTICATION_BACKENDS = (
    'social_core.backends.open_id.OpenIdAuth' ,     # for Google authentication
    'social_core.backends.google.GoogleOpenId',     # for Google authentication
    'social_core.backends.google.GoogleOAuth2',     # for Google authentication
    'social_core.backends.github.GithubOAuth2',     # for Github authentication
  # 'social_core.backends.facebook.FacebookOAuth2', # for Facebook authentication
    'django.contrib.auth.backends.ModelBackend',
)
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY    = '243261037962-c4dg6k0nahvsho217f070c3togq62jd6.apps.googleusercontent.com'  #Paste CLient Key
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '2FX1OYni7_LhdNgpQuwgPQzE'  #Paste Secret Key
