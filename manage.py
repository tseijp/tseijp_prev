#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         TSEI .jp         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         ver3.0.0         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""         20.08.06         """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """""""""""""""""""""""""                          """""""""""""""""""""""""  #
#  """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""  #
import os
import sys
import shutil
import socket
import subprocess as sub

#  """""""""""""""""""""""""  FOR UTILS  """""""""""""""""""""""""  #
def printqr():
    try:
        host = socket.gethostname()
        ip = socket.gethostbyname(host)
        print('\n\n  Open http://%s:3000'%ip)
        sub.run(['qr','http://%s:3000'%ip], shell=True, cwd='.')
    except:
        pass

def main():
#  """""""""""""""""""""""""  FOR COMMAND  """""""""""""""""""""""""  #
    def run (*args):
        sub.run([*args,'runserver','0.0.0.0:8000'], shell=True, cwd=".")
        sub.run("start http://localhost:8000".split(), shell=True, cwd='.')

    def test(*args):
        proc = sub.Popen("npm run jest".split(), shell=True, cwd='./core')
        sub.run([*args,'runserver','0.0.0.0:8000'], shell=True, cwd=".")
        proc.close()

    def start(*args):
        proc = sub.Popen("npm start".split(), shell=True, cwd='./core')
        printqr()
        run(*args)
        proc.close()

    def static(*args):
        sub.run([*args, *'collectstatic -c --noinput'.split()], shell=True)

    def update(*args):
        sub.run("npm run compile".split(), shell=True, cwd='./core')
        sub.run("npm run build".split(), shell=True, cwd='./core')
        static(*args)

    # TODO
    def init(*args):
        sub.run("git submodule foreach git fetch".spit(), shell=True, cwd='.')
        sub.run("npm run build".split(), shell=True, cwd='./core')
        sub.run("npm run build".split(), shell=True, cwd='./core/src/components/colo')
        sub.run("npm run build".split(), shell=True, cwd='./core/src/components/mdmd')
        sub.run("npm run build".split(), shell=True, cwd='./core/src/hooks/use-grid' )
        sub.run("npm run build".split(), shell=True, cwd='./core/src/hooks/use-amazon')
        static(*args)
#  """""""""""""""""""""""""  FOR DJANGO  """""""""""""""""""""""""  #
    try:
        for key, fn in locals().items():
            if sys.argv[-1] == key:
                return fn(sys.executable, sys.argv[0])
    except ImportError as exc:
        raise Error(
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
