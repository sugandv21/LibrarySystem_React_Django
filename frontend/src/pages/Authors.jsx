import React, { useState } from "react";
import AuthorList from "../components/AuthorList";
import AuthorForm from "../components/AuthorForm";

export default function Authors() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAuthor, setEditingAuthor] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-1">
        <AuthorForm
          editingAuthor={editingAuthor}
          onSaved={() => { setRefreshKey(k => k + 1); setEditingAuthor(null); }}
          onCancel={() => setEditingAuthor(null)}
        />
      </div>

      <div className="md:col-span-2">
        <AuthorList
          refreshKey={refreshKey}
          onEdit={(a) => setEditingAuthor(a)}
        />
      </div>
    </div>
  );
}
