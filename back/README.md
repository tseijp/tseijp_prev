# Backend Code

### version
- Python : 3.6 ~
- Django : 3.0 ~ ?
- Djangorest : 3.11~

### available URL

URL    |Description
:------|:-
admin/ |Admin Pages
auth/  |Distribute Auth Token
api/   |Restful Api Router
api/note/3 |Note Detail
api/note/x |Note List of specific user
api/note/3/xxx |edit Note data using ajax

### available API

__from api/note/__

Key|Description  
:--|:----------  
next    |next pagination url  
previous|previous pagination url  
results |seriaized data as array  
isAuth  |Get whether request user is authorized

__note in results from api/note/__
Key|Description  
:--|:----------  
id          |primary key.
ja_text     |text data.
en_text     |text data.
is_author   |whether request user is author.
author_name |username of posted user.
posted_time |time when it was posted.

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

********************************************************************************
# REF
## Django Rest
ref
- https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py
- https://github.com/encode/django-rest-framework/blob/master/rest_framework/pagination.py


__param of generics.GenericAPIView__

Key|Default|Description  
:--|:------|:----------  
queryset        |None |Get the queryset instance.  
serializer_class|None |Return the serializer class.  
lookup_field    |'pk' |The model field for object lookup..  
lookup_url_kwarg|None |The URL field for custom lookup.  
filter_backends |DEFAULT_FILTER_BACKENDS |Return the filter backend classes.  
pagination_class|DEFAULT_PAGINATION_CLASS|The style to use for queryset pagination.  

__function of generics.GenericAPIView__

Key|Description  
:--|:----------  
get_queryset          |Get the list of items for this view.  
get_object            |Return the object the view is displaying.  
get_serializer        |Return the serializer instance.  
get_serializer_class  |Return self.serializer_class.  
get_serializer_context|Return self.request and self.format_kwarg.  
filter_queryset       |Given a queryset, filter it with whichever filter backend is in use.  
paginator             |Return the paginator instance associated with the view, or `None`.  
paginate_queryset     |Return a single page of results, or `None` if pagination is disabled.  
get_paginated_response|Return a paginated style `Response` object for the given output data.  

__param of pagination.CursorPagination__

Key |Default |Description  
:---|:-------|:----------  
cursor_query_param         |'cursor'|The query name in url.  
cursor_query_description   |_('~~') |Get the message 'The pagination cursor value'
invalid_cursor_message     |_('~~') |Get the message 'Invalid cursor' if none  
page_size_query_description|_('~~') |Number of results to return per page.  
page_size|PAGE_SIZE |The number of page size.
ordering |'-created'|the fields of applied patination.  
template |'~~/.html'|template name of slice page controller  
page_size_query_param |None |The page size using this query parameter.  
max_page_size         |None |Tthe maximum page size the client may request.  
offset_cutoff         |1000 |The maximum possible size of the offset.  

__function of pagination.CursorPagination__

Key|Description  
:--|:----------  
paginate_queryset|Get list of queryset by pagination
get_page_size    |Get size by
get_previous_link|Get
get_next_link    |
get_ordering     |Return a tuple of strings as `order_by` method.
decode_cursor    |Given a request with a cursor
encode_cursor    |Given a Cursor instance
get_paginated_response       |Return response with paginated link and data
get_paginated_response_schema|Return response schema

## restful pagination for Cursor
ref
- https://www.django-rest-framework.org/api-guide/pagination/
- https://www.django-rest-framework.org/api-guide/pagination/#cursorpagination
- https://www.slideshare.net/c-bata/django-rest-framework-api-pycon-jp-2018-114941317

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

__Request limitation__
- CDN (akamai,fastly,cloudflare)
- Reverse Proxy (Nginx, apache)
- Django AnonRateThrottle  : for non auth user using ip addres
- Django UserRateThrottle  : for authed user   using auth token
- Django ScopedRateThrottle: for unique heavy endpoint
