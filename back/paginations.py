from rest_framework.pagination import CursorPagination
# pagination_class = NotePagination

class NotePagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'c'
    ordering = ('id', )
