from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book, Author
from .serializers import BookSerializer, AuthorSerializer
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404

# Books - CBVs
class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all().select_related('author').order_by('-created_at')
    serializer_class = BookSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description', 'author__name']

    def get_queryset(self):
        qs = super().get_queryset()
        author_name = self.request.query_params.get('author_name')
        if author_name:
            qs = qs.filter(author__name__icontains=author_name)
        return qs

class BookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all().select_related('author')
    serializer_class = BookSerializer

# Authors - FBVs
@api_view(['GET', 'POST'])
def author_list_create(request):
    if request.method == 'GET':
        authors = Author.objects.all().order_by('name')
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def author_detail(request, pk):
    author = get_object_or_404(Author, pk=pk)
    if request.method == 'GET':
        serializer = AuthorSerializer(author)
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        serializer = AuthorSerializer(author, data=request.data, partial=(request.method=='PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
