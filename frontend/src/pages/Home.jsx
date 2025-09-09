import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function Home() {
  const { request } = useApi();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: b }, { data: a }] = await Promise.all([
          request("/books/"),
          request("/authors/"),
        ]);
        setBooks(b || []);
        setAuthors(a || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [request]);

  return (
    <div className="p-6">
      {/* Main heading */}
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        Welcome to Library
      </h1>

      {/* Books Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {books.slice(0, 4).map((book) => (
            <div key={book.id} className="p-3 border rounded bg-white shadow-sm">
              <h3 className="font-semibold ">{book.title}</h3>
              <div className="text-sm text-gray-600">
                by {book.author?.name}
              </div>
              <div className="text-sm">Age: {book.book_age}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Authors Section */}
      <section>
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">Authors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {authors.slice(0, 6).map((a) => (
            <div key={a.id} className="p-3 border rounded bg-white shadow-sm">
              <div className="font-semibold ">{a.name}</div>
              <div className="text-sm text-gray-700">{a.email}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
