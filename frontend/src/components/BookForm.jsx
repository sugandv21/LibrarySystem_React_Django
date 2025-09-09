import React, { useState, useEffect } from "react";
import { useApi } from "../api/useApi";

export default function BookForm({ editingBook=null, onSaved, onCancel }) {
  const { request } = useApi();
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", author_id: "", published_year: new Date().getFullYear() });
  const [saving, setSaving] = useState(false);

  useEffect(()=> {
    (async ()=> {
      try {
        const { data } = await request("/authors/");
        setAuthors(data || []);
      } catch(e){ console.error(e); }
    })();
  }, [request]);

  useEffect(()=> {
    if (editingBook) {
      setForm({
        title: editingBook.title || "",
        description: editingBook.description || "",
        author_id: editingBook.author?.id || "",
        published_year: editingBook.published_year || new Date().getFullYear(),
      });
    } else {
      setForm({ title: "", description: "", author_id: "", published_year: new Date().getFullYear() });
    }
  }, [editingBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        author_id: Number(form.author_id),
        published_year: Number(form.published_year),
      };
      if (editingBook) {
        await request(`/books/${editingBook.id}/`, { method: "PATCH", body });
      } else {
        await request("/books/", { method: "POST", body });
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Error saving book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold mb-3">{editingBook ? "Edit Book" : "Add Book"}</h2>
      <div className="mb-2">
        <label className="block text-sm">Title</label>
        <input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Author</label>
        <select required value={form.author_id} onChange={e=>setForm({...form, author_id: e.target.value})} className="w-full p-2 border rounded">
          <option value="">Select author</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm">Published Year</label>
        <input type="number" required value={form.published_year} onChange={e=>setForm({...form, published_year: e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm">Description</label>
        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>{editingBook ? "Save" : "Create"}</button>
        {editingBook && <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>}
      </div>
    </form>
  );
}
