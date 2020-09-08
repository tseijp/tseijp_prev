from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination

# CursorPagination : github.com/encode/django-rest-framework/blob/master/rest_framework/pagination.py#L574
#   The cursor pagination implementation is necessarily complex.
#   For an overview of the position/offset style we use, see this post:

class NotePagination(CursorPagination):
    page_size = 5
    cursor_query_param = 'cursor'
    ordering = '-id'  # TODO : home is -id, detail is id
    invalid_cursor_message = {'results':'Invalid cursor(;_;)'}
### Client can control the page size using this query parameter.
#   page_size_query_param = 'size'
#   page_size_query_description = _('Number of results to return per page.')
#
### Set to an integer to limit the maximum page size the client may request.
    max_page_size = 5
#   template = "rest_framework/pagination/numbers.html"
#
### The offset in the cursor is used in situations where we have a nearly-unique index.
    offset_cutoff = 100 # 1000
    def get_ordering(self, request, queryset, view):
        view_ordering = getattr(view, 'ordering', None)
        if view_ordering:
            self.ordering = view_ordering
        return super(NotePagination, self).get_ordering(request, queryset, view)
