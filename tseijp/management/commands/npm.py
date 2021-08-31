import os
from subprocess import run
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "manage npm commands"
    cmds = ["start", "run", "publish", "install", "uninstall"]
    dirs = os.listdir()

    def add_arguments(self, parser):
        for dir in self.dirs:
            args = ['--%s' % dir]
            help = "for %s" % dir
            parser.add_argument(*args, action="store_true", help=help)

        for cmd in self.cmds:
            args = ['--%s' % cmd, '-%s' % cmd[0]]
            help = "run %s" % cmd
            parser.add_argument(*args, nargs='*', help=help)

    def handle(self, *args, **opts):
        for cmd in self.cmds:
            for dir in self.dirs:
                self.run(cmd, dir, *args, **opts)

    def run(self, cmd, dir, *args, **opts):
        if opts[cmd] is None:
            return
        if opts[dir] is False:
            return
        arg = ["npm", cmd, *opts[cmd]]
        cwd = "./%s" % dir
        run(arg, shell=True, cwd=cwd)
