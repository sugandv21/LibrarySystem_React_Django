from rest_framework import serializers
from .models import Book, Author
from datetime import date

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'email']

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), source='author', write_only=True, required=True
    )
    book_age = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'description', 'author', 'author_id', 'published_year', 'book_age', 'created_at']

    def get_book_age(self, obj):
        return date.today().year - obj.published_year

    def validate_published_year(self, value):
        current_year = date.today().year
        if value > current_year:
            raise serializers.ValidationError("Published year cannot be in the future.")
        return value

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value
