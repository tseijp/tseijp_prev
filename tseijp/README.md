# TSEIJP

## Directions for getting started
You can do this by hand or just run `python manage.py direction`.

- First get the latest Python dll
- `pip install -r "tseijp/requirements.txt"`
- `python manage.py runserver`
- open browser and visit [localhost:8000](https://localhost:8000)
- Now you can go to our [demo](https://tsei.jp), and try its usage.

## How to initialize submodules
You can do this by hand or just run `python manage.py initialize`.

- `git submodule update --init --recursive`
- `git submodule foreach git pull`
- `git submodule foreach npm i`
- `git submodule foreach npm run build`
- `python manage.py collectstatic -c --no-input`

## How to reset submodules
You can do this by hand or just run `python manage.py reset`.
- `git pull origin master`
- `git reset --hard origin/master`
- `git submodule git pull origin master`
- `git submodule git reset --hard origin/master`
- `sudo systemctl restart gunicorn.service`
