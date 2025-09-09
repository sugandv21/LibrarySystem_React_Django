import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function AuthorList({ refreshKey = 0, onEdit }) {
  const { request, loading, error } = useApi();
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await request("/authors/");
        if (mounted) setAuthors(data || []);
      } catch (err) {
        console.error("Failed to load authors", err);
      }
    })();
    return () => { mounted = false; };
  }, [request, refreshKey]);

  if (loading) return <p className="p-4">Loading authors...</p>;
  if (error) return <p className="p-4 text-red-600">Error loading authors</p>;

  return (
    <div className="space-y-3">
      {authors.length === 0 ? <p>No authors yet.</p> : authors.map(a => (
        <div key={a.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-gray-600">{a.email}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-yellow-400 rounded" onClick={() => onEdit && onEdit(a)}>Edit</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={async () => {
              if (!confirm("Delete author?")) return;
              try {
                await request(`/authors/${a.id}/`, { method: "DELETE" });
                setAuthors(prev => prev.filter(x => x.id !== a.id));
              } catch (e) { alert("Delete failed"); }
            }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
