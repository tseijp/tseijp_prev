cd frontend
call scripts\build.bat
cd ..
python manage.py collectstatic -c --noinput
