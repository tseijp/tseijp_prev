### django
from django.shortcuts import render
from django.views.generic import ListView#, CreateView, DetailView, UpdateView, DeleteView

### my created
from app_mesh.models import *

def get_link(request):
    link = request.GET['l'] if 'l' in request.GET                      else 0
    return link if link and MeshModel.objects.filter(posted_link=link) else 0

def get_objs(request):
    link = get_link(request)
    return MeshModel.objects.filter(posted_link=link) if link else 0

circles_list = [
    {"rad":"2.654","rot":" 90","pos":" 0.500 0 1.154"},
    {"rad":"1.654","rot":"180","pos":"-0.500 0 1.154"},
    {"rad":"1.000","rot":"270","pos":"-0.500 0 0.500"},
    {"rad":"0.654","rot":"360","pos":"-0.154 0 0.500"},
    {"rad":"0.346","rot":" 90","pos":"-0.154 0 0.808"},
    ]
# Create your views here.
def test(request):
    return render(request, 'app_mesh/test.html', {'circles_list':circles_list})



class MeshListView(ListView):
    model         = MeshModel
    template_name = "app_mesh/mesh_home.html"
    def get_queryset(self):### 新しい順に表示 & コメント以外を取得
        link     = get_link(self.request)
        objs     = get_objs(self.request)
        queryset = objs if link else MeshModel.objects.order_by('-id')
        print('\n\n\tlink:',link,'\n\tobjs:',objs,'\n\tqueryset:',queryset,'\n\n')
        return queryset
    def get_context_data(self):
        link    = get_link(self.request)
        context = super().get_context_data()
        context['link']   = '%s'%link     if link else 0
        context['circles_list'] = circles_list
        return context
