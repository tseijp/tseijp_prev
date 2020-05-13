cd frontend
npm run build
cd mdmd
npm run build
cd ../..
python3 manage.py collectstatic
