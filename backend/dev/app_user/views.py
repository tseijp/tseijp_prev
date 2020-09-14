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

webhook_url = 'https://hooks.slack.com/services/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'
cat_iframes = [
    '<iframe src="https://giphy.com/embed/JIX9t2j0ZTN9S" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/JIX9t2j0ZTN9S">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/VbnUQpnihPSIgIXuZv" width="384" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/computer-cat-wearing-glasses-VbnUQpnihPSIgIXuZv">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/jRlP4zbERYW5HoCLvX" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jRlP4zbERYW5HoCLvX">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/33OrjzUFwkwEg" width="435" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-33OrjzUFwkwEg">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/UZzuqeBeRcD3W" width="480" height="346" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/dance-dancing-cat-UZzuqeBeRcD3W">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/6bAZXey5wNzBC" width="480" height="336" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-kitty-funny-6bAZXey5wNzBC">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/uZxa6mNaSihVu" width="480" height="272" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-funny-uZxa6mNaSihVu">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/CCK9EUDEIe2sw" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-everybody-CCK9EUDEIe2sw">via GIPHY</a></p>',
]

def get_cat_iframe():
    import random
    return random.choices(cat_iframes)[0]

@requires_csrf_token
def my_customized_server_error(request, template_name='500.html'):
    import json
    import requests
    import traceback
    requests.post(
        webhook_url,
        data=json.dumps({
            'text': '\n'.join([
                f'Request uri: {request.build_absolute_uri()}',
                traceback.format_exc(),
            ]),
            'username': 'Django Server Error 500',
            'icon_emoji': ':jack_o_lantern:',
        })
    )
    message  = '<h1>Server Error (500)</h1>'
    message += '<h5>t1810394@edu.cc.uec.ac.jp</h5>'
    message += get_cat_iframe()
    return HttpResponseServerError(message)

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
