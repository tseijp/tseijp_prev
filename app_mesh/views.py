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

circles = {
    "page":{"rot":270,"x": 0.500,"y":0,"z":-0.500,"R":4.308,"c1": 1,"c2": 1},
    "text":{"rot":180,"x": 0.500,"y":0,"z": 1.154,"R":2.654,"c1":-1,"c2": 1},
    "main":{"rot": 90,"x":-0.500,"y":0,"z": 1.154,"R":1.654,"c1":-1,"c2":-1},
    "mark":{"rot":360,"x":-0.500,"y":0,"z": 0.500,"R":1.000,"c1": 1,"c2":-1},
    "none":{"rot":270,"x":-0.154,"y":0,"z": 0.500,"R":0.654,"c1": 1,"c2": 1},
    "code":{"rot":180,"x":-0.154,"y":0,"z": 0.808,"R":0.346,"c1":-1,"c2": 1},}
for c in circles.values():
    c["r"] =c["R"]/2
    c["r0"]={"x":c["x"]+c["r"]*c["c1"],       "y":0, "z":c["z"]+c["r"]*c["c2"]}
    c["r1"]={"x":c["x"]+c["r"]*c["c1"]-c["r"],"y":0, "z":c["z"]+c["r"]*c["c2"]-c["r"]}
    c["r2"]={"x":c["x"]+c["r"]*c["c1"]+c["r"],"y":0, "z":c["z"]+c["r"]*c["c2"]+c["r"]}
    c["r3"]={"x":c["x"]+c["r"]*c["c1"]+c["r"],"y":0, "z":c["z"]+c["r"]*c["c2"]-c["r"]}
    c["r4"]={"x":c["x"]+c["r"]*c["c1"]-c["r"],"y":0, "z":c["z"]+c["r"]*c["c2"]+c["r"]}
# Create your views here.
context_data = {'circ':circles}
#from django.contrib.auth.decorators import login_required

#@login_required(login_url='/login')
def mesh_test(request):
    l = request.GET['l'] if 'l' in request.GET else ''
    if l=="b": return render(request, 'app_mesh/test/test_bar.html')
    if l=="d": return render(request, 'app_mesh/test/test_mdb.html')
    if l=="k": return render(request, 'app_mesh/test/test_key.html')
    if l=="i": return render(request, 'app_mesh/test/test_ini.html',context_data)
    if l=="m": return render(request, 'app_mesh/test/test_map.html')
    if l=="p": return render(request, 'app_mesh/test/test_par.html')
    if l=="r": return render(request, 'app_mesh/test/test_rot.html')
    if l=="s": return render(request, 'app_mesh/test/test_sel.html')
    if l=="n": return render(request, 'app_mesh/test/test_now.html',context_data)
    else: return render(request, 'app_mesh/test/test.html')



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
        context['circ']   = circles
        return context
