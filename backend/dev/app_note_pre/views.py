from datetime import datetime
from googletrans import Translator

from django.urls import reverse_lazy
from django.utils import timezone
from django.contrib import messages
from django.db.models import Q, QuerySet
from django.shortcuts import render, redirect
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.views.generic.edit import ModelFormMixin
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
### my created
from app_note.forms   import *
from app_note.models  import *
from app_note.values  import *
from app_user.values  import *
from app_note.initial import *
#def p(txt):print('\n\n');print('>>>>'+str(txt));print('\n\n')
def md_to_text():pass
def get_id  (request):
    id = request.GET['id'] if 'id' in request.GET else 0
    return id if id and id.isdigit() and NoteModel.objects.filter(id=id) else 0
def get_tag (request):return request.GET['tag'] if'tag'in request.GET else ''
def get_year_month(request):
    if   'year'  in request.GET: year  = int(request.GET['year'])
    else: year = int(timezone.datetime.now().strftime('%Y'))
    if   'month' in request.GET: month = int(request.GET['month'])
    else: month= int(timezone.datetime.now().strftime('%m'))
    return year, month
def get_anonymous():
    anonymous = User.objects.get(username="anonymous")
    return anonymous if anonymous else User.objects.create_user('anonymous','None', 'johnpassword')
def get_user(user_id=None):
    if not user_id: return get_anonymous()
    user = User.objects.get(id=user_id)
    return user if user else get_anonymous()
### import dateutil.parser

# Create your views here.
@login_required
def test(request): return render(request, 'note_test.html')
def home(request): return render(request, 'index.html')

class NoteHomeView(ListView, ModelFormMixin):
    model        = NoteModel
    form_class   = NoteEditForm
    form         = NoteEditForm()
    paginate_by  = 10
    template_name= 'app_note/note_list.html'
    def get(self, request, *args, **kwargs):
        self.object = None
        return super().get(request, *args, **kwargs)
    def get_success_url(self):
        id     = get_id(self.request)
        if id:return reverse_lazy('note')+"?id=%s"%id
        else :return reverse_lazy('note')+"?id=%s"%self.object.id
    def get_queryset(self):### 新しい順に表示 & コメント以外を取得
        year, month   = get_year_month(self.request)
        tag           = get_tag(self.request)
        id            = get_id(self.request)
        q_isid = Q(id=id)
        q_tags = Q(posted_tag__icontains=tag) if tag else Q()
        q_main = Q(note_object__isnull=True)
        q_come = Q(note_object__isnull=False)
        if id:queryset = NoteModel.objects.filter(q_tags).get(q_isid).get_children()
        else :queryset = super().get_queryset().filter(q_tags).filter(q_main).order_by('-id')
        return queryset
    def get_context_data(self): ### pageを開いたときに処理.templateに返す値を制御
        context = super().get_context_data()      ### **kwargsあるとError
        tag     = get_tag(self.request)
        id      = get_id(self.request)
        id_objs = NoteModel.objects.filter(id=id)
        id_note = id_objs[0] if id_objs else None
        id_user = get_user(id_note.posted_user.id) if id_objs else None
        context['id']            = int(id)
        context['id_note']       = id_note
        context['id_user']       = id_user
        context['page_tag'    ]  = tag
        context['url_with_id' ]  = 'id=%s;'%id                     if id else ''
        context['url_with_tag']  = 'tag=%s;'%get_tag(self.request) if tag else ''
        context['carousel'    ]  = note_list_context['carousel']
        context['content'     ]  = get_index_content("note")
        context['child_id'    ]  = id_note.get_child_id()    if id_note else []
        context['chichild_id' ]  = id_note.get_chichild_id() if id_note else []
        return context
    def post(self, request, *args, **kwargs):
        tag    = get_tag(self.request)
        user   = get_user(self.request.user.id)
        id     = get_id(self.request)
        note   = NoteModel.objects.get(id=id) if id else None
        self.object      = None               ### ないとエラー
        self.object_list = self.get_queryset()### ないとエラー
        form = self.get_form();#print(self.request.POST)
        if form.is_valid():
            if  tag:form.instance.posted_tag  = tag
            if user:form.instance.posted_user = self.request.user
            if note:form.instance.note_object = note
            form.instance.ja_head = ""
            form.instance.ja_text = ""
            form.instance.save()
            return super().form_valid(form)
        else:
            return super().form_invalid(form)

class NoteJaView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_ja.html"
class NoteEnView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_en.html"
class NoteDeleteView(LoginRequiredMixin, DeleteView):
    model               = NoteModel
    success_url         = reverse_lazy("note")
    context_object_name = 'Note'
    template_name       = "app_note/note_delete.html"
    login_url           =  reverse_lazy('login')


''' NOT USED ----- NOT USED ----- NOT USED ----- NOT USED ----- NOT USED -----'''
'''
def qiita_note_new(request, dict, tags):
    init_obj_id=0
    ja_objs ={}
    for i,note in dict.items():
        if not i in ja_objs:
            obj = NoteModel.objects.create()
            obj.posted_user=request.user
            obj.ja_head=note["head"]
            obj.ja_text=note["text"]
            obj.save()
            ja_objs[i]       = obj
        else:
            obj = ja_objs[i]
            obj.en_head=note["head"]
            obj.en_text=note["text"]
        if "%s"%i=="%s"%1: init_obj_id= obj.id
        elif init_obj_id:
            obj.note_object=NoteModel.objects.get(id=init_obj_id)
        obj.posted_tag = tags
        obj.posted_img = note["img"] if "img" in note else ''
        obj.save()
        print(i,init_obj_id,obj)

@login_required
def qiita_init(request):
    NoteModel.objects.all().delete()
    qiita_note_new(request, note_qiita_8 ,"#touchdesigner #pytorch")
    qiita_note_new(request, note_qiita_16,"#AWS #Nginx #Django")
    return redirect ('note')
'''

"""
@login_required
def drop_all(request):
    NoteModel.objects.all().delete()
    return redirect('note')
"""
#class NotePostedRawView(DetailView):
#    model         = NoteModel
#    template_name = "app_note/note_posted_raw.html"
#class NoteUpdateRawView(DetailView):
#    model         = NoteModel
#    template_name = "app_note/note_update_raw.html"
'''
class NoteDetailView(DetailView):
    model        = NoteModel
    model        = NoteModel
    form_class   = NoteEditForm
    form         = NoteEditForm()
    paginate_by  = 10
    template_name= "app_note/detail/note_detail.html"
    def get_context_data(self,**kwargs): ### pageを開いたときに処理.templateに返す値を制御
        context = super(DetailView,self).get_context_data(**kwargs)
        context['content'   ]  = get_index_content("note")
        return context
class NoteEditView(UpdateView):
    model         = NoteModel
    form_class    = NoteEditForm
    success_url   = reverse_lazy("note")
    template_name = "app_note/form/note_form.html"
    def form_valid(self, form):### ボタンを押すと, posted_### を更新
        self.object.update_text = self.object.posted_text
        self.object.update_head = self.object.posted_head
        self.object.update_tag  = self.object.posted_tag
        self.object.save()
        form.instance.save()
        print('\n\nnoteedit_formvalid\n\n')
        return super().form_valid(form)
    def get_context_data(self):
        context = super().get_context_data()
        #context.update({'tool_form': ToolForm()})
        return context
'''
