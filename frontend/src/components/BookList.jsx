import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function BookList({ refreshKey = 0, onEdit }) {
  const { request, loading, error } = useApi();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [q, setQ] = useState("");
  const [authorName, setAuthorName] = useState("");

  const fetchBooks = async () => {
    try {
      let url = "/books/";
      const params = new URLSearchParams();
      if (authorName) params.append("author_name", authorName);
      if (q) params.append("search", q);
      if ([...params].length) url = `${url}?${params.toString()}`;
      const { data } = await request(url);
      setBooks(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch books on mount + when refreshKey changes
  useEffect(() => { fetchBooks(); }, [request, refreshKey]);

  // fetch authors on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await request("/authors/");
        setAuthors(data || []);
      } catch (err) {
        console.error("Failed to load authors", err);
      }
    })();
  }, [request]);

  // refetch books when filters change (debounced)
  useEffect(() => {
    const t = setTimeout(() => fetchBooks(), 300);
    return () => clearTimeout(t);
  }, [q, authorName]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-600">Error loading books</p>;

  return (
    <div>
      {/* Search + Filter */}
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="p-2 border rounded flex-1"
          placeholder="Search title/description"
        />

        <select
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((b) => (
          <div key={b.id} className="p-3 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{b.title}</h3>
                <div className="text-sm text-gray-600">
                  Author: {b.author?.name}
                </div>
                <div className="text-sm">
                  Published: {b.published_year} • Age: {b.book_age}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEdit && onEdit(b)}
                  className="px-3 py-1 bg-yellow-400 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete book?")) return;
                    try {
                      await request(`/books/${b.id}/`, { method: "DELETE" });
                      setBooks((prev) => prev.filter((x) => x.id !== b.id));
                    } catch (e) {
                      alert("Failed to delete");
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {books.length === 0 && <p>No books found.</p>}
      </div>
    </div>
  );
}
