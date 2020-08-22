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

#  """""""""""""""""""""""""  FOR COMMAND  """""""""""""""""""""""""  #
def start(*args):
    proc = sub.Popen([*args,'runserver','0.0.0.0:8000'],shell=True,cwd=".")
    sub.run("start http://localhost:8000".split(), shell=True, cwd='.')
    printqr()
    sub.run("npm start".split(), shell=True, cwd='./frontend')
    proc.close()

def static(*args):
    sub.run([*args,*'collectstatic -c --noinput'.split()], shell=True)

def update(*args):
    sub.run("npm run build --prefix frontend".split(), shell=True, cwd='.')
    static(*args)

def fetch(*args):
    sub.run('git fetch'.split(), shell=True, cwd='.')
    #sub.run('git reset --hard origin/master'.split(), shell=True, cwd=".")
    static(*args)

async def init(*args):
    return ''' TODO
    await sub.run([*args, 'startproject', 'temp'], shell=True, cwd='../')
    await shutil.move('../temp/tseijp', './')
    await shutil.rmtree('../temp')
    await sub.run([*args, 'createsuperuser'], shell=True, cwd='../')
'''

#  """""""""""""""""""""""""  FOR MAIN  """""""""""""""""""""""""  #
def main():
    # """""""""" FOR MANAGE """""""""" #
    args = [sys.executable, sys.argv[0]]
    if (sys.argv[-1]=="start"):
        return start(*args)
    if (sys.argv[-1]=="static"):
        return static(*args)
    if (sys.argv[-1]=="update"):
        return update(*args)
    if (sys.argv[-1]=="fetch"):
        return fetch(*args)
    if (sys.argv[-1]=="init"):
        return init(*args)
    #  """"""""""  FOR DJANGO  """"""""""  #
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE',
        'tseijp.settings.dev'
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
