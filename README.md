# TSEI.jp

### Build JSX
* cd frontend
* npm run build
* git clone https://github.com/tseijp/mdmd
* cd mdmd
* npm run build
* cd ../..
* python manage.py collectstatic

### for Model
using in React only ...
* ja_text
* en_text
* posted_user
* posted_time
* like_object
* note_object

### for Trans
click: TransToggle => Trans => Layout => App =(props.lang)=> NoteCard(change state)
text : Django => App => NoteCard(main state) => redner in Embed and Textarea
