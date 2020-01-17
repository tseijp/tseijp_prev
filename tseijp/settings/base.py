import os
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',]
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
    'DIRS': [os.path.normpath(os.path.join(BASE_DIR, "tseijp/templates")), ],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',],},},]
WSGI_APPLICATION = 'tseijp.wsgi.application'
# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},]
# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N  = True
USE_L10N  = True
USE_TZ    = True
### my changed -----------------------------------------------------------------
INSTALLED_APPS+=['app_%s'%a for a in ['idea','note','user','mesh']]
INSTALLED_APPS+=[
    'django_hosts'  ,# it's sub domain lib for exam : note.tsei.jp/1
    'widget_tweaks' ,# from ocw
    'social_django' #  signup with google
]
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
