import os
import os.path as osp
# Build paths inside the project like this: osp.join(BASE_DIR, ...)
BASE_DIR = osp.dirname(osp.dirname(osp.dirname(osp.abspath(__file__))))
# Application definition
INSTALLED_APPS = ['django.contrib.%s'%s for s in ['admin','auth','contenttypes','sessions','messages','staticfiles']]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',]
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [osp.normpath(osp.join(BASE_DIR, "frontend")), ],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',],},},]
WSGI_APPLICATION = 'tseijp.wsgi.application'
# Password validation
AUTH_PASSWORD_VALIDATORS = [{'NAME': 'django.contrib.auth.password_validation.%s'%s} for s in
   ['UserAttributeSimilarityValidator','MinimumLengthValidator'  ,
    'CommonPasswordValidator'         ,'NumericPasswordValidator',] ]
# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N  = True
USE_L10N  = True
USE_TZ    = True


###################### static #############################
STATIC_URL = 'static/'
STATIC_ROOT = osp.join(BASE_DIR, "static/")
STATICFILES_DIRS = [ osp.join(BASE_DIR, "%s"%s) for s in [
    'frontend/public/static/',
    'frontend/build/static/',
    'frontend/mdmd/build/static/',
    'frontend/colo/build/static/',
    'frontend/use-amazon/build/static',
    ]]
###################### my changed #############################
###  sosial auth signup with google
###  [ref](https://qiita.com/moi1990sk/items/a849fca7acb29db95508)
TEMPLATES[0]['OPTIONS']['context_processors']+=[
    'social_django.context_processors.backends',       # <- #  signup with google
    'social_django.context_processors.login_redirect', # <- #  signup with google
]
AUTHENTICATION_BACKENDS = (
 'social_core.backends.open_id.OpenIdAuth' ,     # for Google authentication
 'social_core.backends.google.GoogleOpenId',     # for Google authentication
 'social_core.backends.google.GoogleOAuth2',     # for Google authentication
 'social_core.backends.github.GithubOAuth2',     # for Github authentication
 #'social_core.backends.facebook.FacebookOAuth2', # for Facebook authentication
 'django.contrib.auth.backends.ModelBackend',
)
LOGIN_URL           = 'login'
LOGIN_REDIRECT_URL  = 'home'
LOGOUT_REDIRECT_URL = 'home'
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY    = '243261037962-c4dg6k0nahvsho217f070c3togq62jd6.apps.googleusercontent.com'  #Paste CLient Key
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '2FX1OYni7_LhdNgpQuwgPQzE'  #Paste Secret Key
### host by django_hosts
ROOT_URLCONF  = 'tseijp.urls'
ROOT_HOSTCONF = 'tseijp.hosts'
DEFAULT_HOST  = 'www'

##################### my changed ######################
INSTALLED_APPS += ['backend']#['app_%s'%app for app in ['note',]]
INSTALLED_APPS += ['rest_framework%s'%s for s in ['','.authtoken']]
INSTALLED_APPS+=[
    'django_hosts'  ,# it's sub domain lib for exam : note.tsei.jp/1
    'widget_tweaks' ,# from ocw
    'social_django' #  signup with google
]
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':('rest_framework.authentication.TokenAuthentication',),
    'DEFAULT_PERMISSION_CLASSES':('rest_framework.permissions.IsAuthenticated' ,),
    'DEFAULT_RENDERER_CLASSES'  : ('rest_framework.renderers.JSONRenderer' ,),#Hide Django rest framework Routers Api
}
