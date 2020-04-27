import os
import inspect

def main(*args):
    try:
        for arg in args:
            log_str()
    except:
        pass

def log_str():
    frame = inspect.currentframe()
    return inspect.getframeinfo(frame)
