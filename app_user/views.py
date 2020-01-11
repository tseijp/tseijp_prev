### Python
from datetime import datetime
### Django
from django.urls import reverse_lazy
from django.utils import timezone
from django.contrib import messages
from django.shortcuts import render, redirect

from django.views.generic       import ListView,CreateView,UpdateView,DeleteView,DetailView
from django.contrib.auth.forms  import UserCreationForm
from django.views.generic.edit  import ModelFormMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User

### error
from django.http import HttpResponseServerError
from django.views.decorators.csrf import requires_csrf_token

### my created
from app_user.forms  import *
from app_user.models import *
from app_user.values import *
#from app_user.user_init import *


def home(request):  return render(request, 'index/index.html', {"content":get_index_content()})
def test(request):  return render(request, 'user_test.html')
def code1(request): return render(request, 'code/tree.html')

@requires_csrf_token
def my_customized_server_error(request, template_name='500.html'):
    return HttpResponseServerError('<h1>Server Error (500)!</h1>t1810394@edu.cc.uec.ac.jp')

class SignupView(CreateView):
    form_class    = UserCreationForm
    success_url   = reverse_lazy('login')
    template_name = 'registration/signup.html'
    def form_valid(self, form):
        #messages.success(self.request, "Hello world")
        #intro = IntroModel.objects.create(user=self.request.user)### intro.back = ###
        #intro.user=self.request.user
        #intro.save()
        return super().form_valid(form)
    def form_invalid(self, form):
        messages.error(self.request, "Error!")
        return super().form_invalid(form)


class UserTopView(DetailView, ModelFormMixin):
    model        = IntroModel
    form_class   = IntroForm
    form         = IntroForm()
    template_name= 'app_user/user_top.html'
    paginate_by  = 9
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cards'] = IntroCardModel.objects.all()
        context['grids'] = IntroGridModel.objects.all()
        return context

class UserEditView(UpdateView):
    model         = IntroForm
    form_class    = IntroForm
    success_url   = reverse_lazy("user")
    template_name = "app_user/user_form_edit.html"
    def form_valid(self, form):### ボタンを押すと, posted_### を更新
        self.object.update_text = self.object.posted_text
        self.object.update_head = self.object.posted_head
        self.object.update_tag  = self.object.posted_tag
        self.object.save()
        form.instance.save()
        print('\n\nuseredit_formvalid\n\n')
        return super().form_valid(form)

class UserDeleteView(LoginRequiredMixin, DeleteView):
    model               = User
    success_url         = reverse_lazy("user")
    template_name = "app_user/user_form_delete.html"
    login_url     =  reverse_lazy('index')

def drop_all(self):
    User.objects.all().delete()
    return redirect('index')
