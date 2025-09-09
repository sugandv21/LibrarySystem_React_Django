import React, { useState } from "react";
import BookList from "../components/BookList";
import BookForm from "../components/BookForm";

export default function Books() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingBook, setEditingBook] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left column: form */}
      <div className="md:col-span-1 space-y-4">
        <BookForm
          editingBook={editingBook}
          onSaved={() => {
            setRefreshKey((k) => k + 1);
            setEditingBook(null);
          }}
          onCancel={() => setEditingBook(null)}
        />
      </div>

      {/* Right column: book list with search & filter */}
      <div className="md:col-span-2">
        <BookList refreshKey={refreshKey} onEdit={(b) => setEditingBook(b)} />
      </div>
    </div>
  );
}
