#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         TSEI .jp         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         ver3.0.0         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         20.09.03         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
import os
import os.path as osp
# """"""""""""""""""""""""" BASE SETTING """"""""""""""""""""""""" #
BASE_DIR = osp.dirname(osp.dirname(osp.dirname(osp.abspath(__file__))))
WSGI_APPLICATION = 'tseijp.wsgi.application'
INSTALLED_APPS = ['django.contrib.%s'%s for s in
   ['admin','auth','contenttypes','sessions','messages','staticfiles']]
AUTH_PASSWORD_VALIDATORS = [
   {'NAME': 'django.contrib.auth.password_validation.%sValidator'%s} for s in
   ['UserAttributeSimilarity','MinimumLength'  ,
    'CommonPassword'         ,'NumericPassword',] ]

# """"""""""""""""""""""""" STATIC SETTINGS """"""""""""""""""""""""" #
STATIC_URL = 'static/'
STATIC_ROOT = osp.join(BASE_DIR, "tseijp/static/")
STATICFILES_FINDERS = ('django.contrib.staticfiles.finders.FileSystemFinder',)
STATICFILES_DIRS = [ osp.join(BASE_DIR,  "%s/build/static/"%s) for s in [
    s for s in os.listdir() if osp.isdir("%s/build/static/"%s)      ]]

# """"""""""""""""""""""""" ORIGINAL SETTINGS """"""""""""""""""""""""" #
INSTALLED_APPS += ['back']
INSTALLED_APPS += ['rest_framework%s'%s for s in ['','.authtoken']]
REST_FRAMEWORK = {'DEFAULT_%s_CLASSES'%a:('rest_framework.%s'%b,) for a,b in
  [['AUTHENTICATION','authentication.TokenAuthentication'],
   ['PERMISSION'    ,'permissions.IsAuthenticated'       ],
   ['RENDERER'      ,'renderers.JSONRenderer'            ]]
}
# """"""""""""""""""""""""" """""""""""""""" """"""""""""""""""""""""" #
# """""""""""""""""""""""""                  """"""""""""""""""""""""" #
# """"""""""""""""""""""""" DEFAULT SETTINGS """"""""""""""""""""""""" #
# """""""""""""""""""""""""                  """"""""""""""""""""""""" #
# """"""""""""""""""""""""" """""""""""""""" """"""""""""""""""""""""" #
LOGIN_URL           = 'login'
LOGIN_REDIRECT_URL  = 'home'
LOGOUT_REDIRECT_URL = 'home'
ROOT_URLCONF  = 'tseijp.urls'
ROOT_HOSTCONF = 'tseijp.hosts' ### host by django_hosts
DEFAULT_HOST  = 'www'
LANGUAGE_CODE = 'en-us'
TIME_ZONE  = 'UTC'
USE_I18N   = True
USE_L10N   = True
USE_TZ     = True
MIDDLEWARE = ['django%smiddleware.%sMiddleware'%(a,b) for a,b in
   [['.', 'common.Common'],
    ['.', 'csrf.CsrfView'],
    ['.', 'security.Security'],
    ['.', 'clickjacking.XFrameOptions'],
    ['.contrib.sessions.', 'Session'],
    ['.contrib.messages.', 'Message'],
    ['.contrib.auth.'    , 'Authentication']] ]
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [osp.normpath(BASE_DIR), ],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors':
       ['django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages']}
}]
