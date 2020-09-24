git fetch
get reset --hard origin/master
python3 manage.py collectstatic -c --noinput
sudo systemctl restart gunicorn.service
