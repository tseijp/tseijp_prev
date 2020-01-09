### django
from django.shortcuts import render
from django.views.generic import ListView#, CreateView, DetailView, UpdateView, DeleteView

### my created
from app_card.models import *

def get_link(request):
    link = request.GET['l'] if 'l' in request.GET                      else 0
    return link if link and CardModel.objects.filter(posted_link=link) else 0

def get_objs(request):
    link = get_link(request)
    return CardModel.objects.filter(posted_link=link) if link else 0

# Create your views here.
def test(request):
    return render(request, 'app_card/test.html')


class CardListView(ListView):
    model         = CardModel
    template_name = "app_card/card.html"

    def get_queryset(self):### 新しい順に表示 & コメント以外を取得
        link     = get_link(self.request)
        objs     = get_objs(self.request)
        queryset = objs if link else  CardModel.objects
        print('\n\n\tlink:',link,'\n\tobjs:',objs,'\n\tqueryset:',queryset,'\n\n')
        return queryset

    def get_context_data(self):
        link    = get_link(self.request)
        context = super().get_context_data()
        context['link'] = '%s'%link     if link else 0
        return context
