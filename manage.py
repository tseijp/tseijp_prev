#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
#  """""""""""""""""""""                          """""""""""""""""""""  #
#  """""""""""""""""""""                          """""""""""""""""""""  #
#  """""""""""""""""""""         TSEI .jp         """""""""""""""""""""  #
#  """""""""""""""""""""         ver3.0.0         """""""""""""""""""""  #
#  """""""""""""""""""""         20.08.06         """""""""""""""""""""  #
#  """""""""""""""""""""                          """""""""""""""""""""  #
#  """""""""""""""""""""                          """""""""""""""""""""  #
#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
import os
import sys
import socket
import subprocess as sub
from django.core.management.utils import get_random_secret_key
#  """""""""""""""""""""""""  FOR UTILS  """""""""""""""""""""""""  #
REQUIREMENTS = "tseijp/requirements.txt"


def printqr():
    try:
        host = socket.gethostname()
        ip = socket.gethostbyname(host)
        print('\n\n  Open http://%s:3000' % ip)
        sub.run(['qr', 'http://%s:3000' % ip], shell=True)
    except ImportError:
        pass


def main():
    def runserver(*args):
        sub.run([*args, 'runserver', '0.0.0.0:8000'], shell=True, cwd=".")
        sub.run("start http://localhost:8000".split(), shell=True)

    def start(*args):
        proc = sub.Popen("npm start".split(), shell=True, cwd='./note')
        runserver(*args)
        proc.close()

    def static(*args):
        opt = "-c --noinput --ignore=static/".split()  # -i static/
        sub.run([*args, 'collectstatic', *opt], shell=True)

    def secret(*args):
        secret_key = get_random_secret_key()
        text = 'SECRET_KEY = \'{0}\''.format(secret_key)
        print(text)

    def update(*args):
        sub.run("git submodule foreach npm run build".split(), shell=True)
        static(*args)
        runserver(*args)

    def direction(*args):
        cmd = [sys.executable, "-m pip install".split(), REQUIREMENTS]
        sub.run(cmd, shell=True)
        runserver(*args)
        sub.run("start http://localhost:8000".split(), shell=True)

    def initialize(*args):
        sub.run("git submodule update --init --recursive".spit(), shell=True)
        sub.run("git submodule foreach git pull".spit(), shell=True)
        sub.run("git submodule foreach npm i".spit(), shell=True)
        sub.run("git submodule foreach npm run build".spit(), shell=True)
        sub.run("start http://localhost:8000".split(), shell=True)
        static(*args)

    def reset(*args):
        sub.run("git pull origin master".spit(), shell=True)
        sub.run("git reset --hard origin/master".spit(), shell=True)
        sub.run("git submodule git pull origin master".spit(), shell=True)
        sub.run("git submodule git reset --hard origin/master".spit(), shell=True)
        sub.run("sudo systemctl restart gunicorn.service".split(), shell=True)

#  """""""""""""""""""""""""  FOR DJANGO  """""""""""""""""""""""""  #
    try:
        for key, fn in locals().items():
            if sys.argv[-1] == key:
                return fn(sys.executable, sys.argv[0])
    except ImportError as exc:
        raise ImportError(
            "Unexpected error (;_;)"
            "Check your custom command."
        ) from exc
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE',
        'tseijp.settings.develop'
    )
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
