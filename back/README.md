# Backend Code

### version
- Python : 3.6 ~
- Django : 3.0 ~ ?
- Djangorest : 3.11~

### available API

URL    | Description
:------|:-
admin/ | Admin Pages
auth/  | Distribute Auth Token
api/   | Restful Api Router

api/note/3 | Note Detail
api/note/x | Note List of specific user
api/note/3/ajax | edit Note using ajax

# restful pagination for Cursor
ref
- https://www.django-rest-framework.org/api-guide/pagination/
- https://www.django-rest-framework.org/api-guide/pagination/#cursorpagination
- https://www.slideshare.net/c-bata/django-rest-framework-api-pycon-jp-2018-114941317

__set pagination__

```python
class MyPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200
    last_page_strings = ('the_end',)

class MyViewSet(viewsets.GenericViewSet):
    pagination_class = LimitOffsetPagination
```
options|detail  
:-|:-  
page_size |number of page size  
cursor_query_param | query name ('cursor')  
ordering | fields of applied patination  
template | template name of slice page controller  

__Pagination in REST Framework__
- PageNumberPagination :`~/?page=4`
- LimitOffsetPagination:`~/limit=5&offset=400`
- CursorPagination     :`~/cursor=cj0xJnA9MjAxOC` (id or time)

__Data irony__
- Relative(page=2)  cant get id:6 if delete id:3
    - Before : (1,2,3,4,5,)6,7,8,9,10
    - After : (1,2,~3~,4,5,6,)7,8,9,10,11
- Absolute(since_id=6) can get id:6 if delete id:3
    - Before : (1,2,3,4,5,)6,7,8,9,10
    - After  : (1,2,~3~,4,5,6,)7,8,9,10,11

# Request limitation
- CDN (akamai,fastly,cloudflare)
- Reverse Proxy (Nginx, apache)
- Django AnonRateThrottle  : for non auth user using ip addres
- Django UserRateThrottle  : for authed user   using auth token
- Django ScopedRateThrottle: for unique heavy endpoint
