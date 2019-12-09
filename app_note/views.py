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
def p(txt):print('\n\n');print('>>>>'+str(txt));print('\n\n')
def md_to_text():pass
def get_id  (request):return int(request.GET['id' ]) if'id' in request.GET else 0
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
def home(request):
    return render(request, 'index.html')

@login_required
def test(request):
    return render(request, 'note_test.html')

class NoteHomeView(ListView, ModelFormMixin):
    model        = NoteModel
    form_class   = NoteEditForm
    form         = NoteEditForm()
    paginate_by  = 10
    template_name= 'app_note/note_list.html'
    def get(self, request, *args, **kwargs):
        self.object = None
        #for obj in self.get_queryset():
        #    if not obj.update_text:
        #        obj.delete()
        return super().get(request, *args, **kwargs)
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
        id_obj  = NoteModel.objects.filter(id=id)
        id_user = id_obj[0].posted_user.id if id_obj else 0
        context['id']            = int(id)
        context['id_user']       = id_user
        context['page_tag'    ]  = tag
        context['url_with_tag']  = 'tag=%s;'%get_tag(self.request) if tag else ''
        context['carousel'    ]  = note_list_context['carousel']
        context['content'     ]  = get_index_content("note")
        context['child_id'    ]  = id_obj[0].get_child_id()    if id_obj else []
        context['chichild_id' ]  = id_obj[0].get_chichild_id() if id_obj else []
        return context
    def get_success_url(self):
        return  reverse_lazy('note')+"?id=%s"%self.object.id
    def post(self, request, *args, **kwargs):
        tag    = get_tag(self.request)
        user   = get_user(self.request.user.id)
        self.object      = None               ### ないとエラー
        self.object_list = self.get_queryset()### ないとエラー
        form = self.get_form();print(self.request.POST)
        if form.is_valid():
            for obj in self.get_queryset():
                if not obj.update_text:
                    obj.delete()
            #if "message" in request.POST:
            #    for k,v in request.POST["message"]:pass
            if  tag:form.instance.update_tag  = tag
            if user:form.instance.posted_user = self.request.user
            form.instance.update_head = ""
            form.instance.update_text = ""
            form.instance.save()
            return super().form_valid(form)
        else:
            return super().form_invalid(form)

class NoteEditView(UpdateView):
    model         = NoteModel
    form_class    = NoteEditForm
    success_url   = reverse_lazy("note")
    template_name = "app_note/note_form.html"
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

class NoteDetailView(DetailView):
    model        = NoteModel
    model        = NoteModel
    form_class   = NoteEditForm
    form         = NoteEditForm()
    paginate_by  = 10
    template_name= "app_note/note_detail.html"
    def get_context_data(self,**kwargs): ### pageを開いたときに処理.templateに返す値を制御
        context = super(DetailView,self).get_context_data(**kwargs)
        context['content'   ]  = get_index_content("note")
        return context

class NotePostedRawView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_posted_raw.html"
class NotePostedFrameView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_posted_frame.html"
class NoteUpdateRawView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_update_raw.html"
class NoteUpdateFrameView(DetailView):
    model         = NoteModel
    template_name = "app_note/note_update_frame.html"

class NoteDeleteView(LoginRequiredMixin, DeleteView):
    model               = NoteModel
    success_url         = reverse_lazy("note")
    context_object_name = 'Note'
    template_name       = "app_note/note_form_delete.html"
    login_url           =  reverse_lazy('login')

@login_required
def qiita_init(request):
    NoteModel.objects.all().delete()
    for i,note in note_qiita_8.items():
        obj = NoteModel.objects.create()
        obj.posted_head=note["head"]
        obj.posted_text=note["text"]
        if "img" in note:obj.posted_img =note["img"]
        obj.update_head=note["head"]
        obj.update_text=note["text"]
        if "img" in note:obj.update_img =note["img"]
        obj.tag ="#touchdesigner #pytorch"
        obj.posted_user=request.user
        if i=="1":init_obj = obj
        else : obj.note_object=init_obj
        obj.save()
        print(obj)
        print(obj.posted_head,obj.note_object,obj.posted_user)
    return redirect ('note')

@login_required
def drop_all(request):
    NoteModel.objects.all().delete()
    return redirect('note')
