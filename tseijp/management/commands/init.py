import sys
from subprocess import run
from django.core.management.base import BaseCommand


python = sys.executable
manage = sys.argv[0]


class Command(BaseCommand):
    help = "Runserver and npm start."
    dirs = "tseijp/requirements.txt"

    def add_arguments(self, parser):
        parser.add_argument('--submodule', '-s', action='store_true', help="for submodules")
        parser.add_argument('--product', '-p', action='store_true', help="for product")
        parser.add_argument('--reset', '-r', action='store_true', help="whitch initialize or reset")

    def handle(self, *args, **opts):
        if opts["submodule"]:
            if opts["reset"]:
                return self.reset_submodule(*args, **opts)
            else:
                return self.init_submodule(*args, **opts)
        elif opts["product"]:
            if opts["reset"]:
                return self.init_product(*args, **opts)
            else:
                return self.reset_product(*args, **opts)
        self.get_started()

    # utils
    def start(self, *args, **opts):
        run([python, manage, 'runserver', '0.0.0.0:8000'], shell=True, cwd=".")
        run("start http://localhost:8000".split(), shell=True)

    def static(self, *args, **opts):
        option = "-c --noinput --ignore=static/".split()  # -i static/
        run([python, manage, 'collectstatic', *option], shell=True)

    # commands
    def get_stared(self, *args, **opts):
        run([python, "-m pip install".split(), self.dirs], shell=True)
        self.start(*args, **opts)

    def init_submodule(self, *args, **opts):
        run("git submodule update --init --recursive".split(), shell=True)
        run("git submodule foreach git pull".split(), shell=True)
        run("git submodule foreach npm install".split(), shell=True)
        run("git submodule foreach npm run build".split(), shell=True)
        self.static(*args, **opts)
        self.start(*args, **opts)

    def reset_submodule(self, *args, **opts):
        run("git pull origin master".split(), shell=True)
        run("git reset --hard origin/master".split(), shell=True)
        run("git submodule git pull origin master".split(), shell=True)
        run("git submodule git reset --hard origin/master".split(), shell=True)
        run("sudo systemctl restart gunicorn.service".split(), shell=True)

    def init_product(self, *args, **opts):
        option = ["--settings", "tseijp.settings.product"]
        run([python, manage, 'makemigrations', *option], shell=True)
        run([python, manage, 'migrate', *option], shell=True)

    def reset_product(self, *args, **opts):
        option = ["--settings", "tseijp.settings.product"]
        run([python, manage, 'makemigrations', *option], shell=True)
        run([python, manage, 'migrate', *option], shell=True)
        run("sudo systemctl restart gunicorn.service".split(), shell=True)
