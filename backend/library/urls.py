from django.urls import path
from .views import (
    BookListCreateView, BookRetrieveUpdateDestroyView,
    author_list_create, author_detail
)

urlpatterns = [
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyView.as_view(), name='book-detail'),
    path('authors/', author_list_create, name='author-list-create'),
    path('authors/<int:pk>/', author_detail, name='author-detail'),
]
