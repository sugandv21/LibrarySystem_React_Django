import React, { useState, useEffect } from "react";
import { useApi } from "../api/useApi";

export default function AuthorForm({ editingAuthor = null, onSaved, onCancel }) {
  const { request } = useApi();

  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [saving, setSaving] = useState(false);

  // modal state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (editingAuthor) {
      setForm({
        name: editingAuthor.name || "",
        email: editingAuthor.email || "",
        bio: editingAuthor.bio || "",
      });
    } else {
      setForm({ name: "", email: "", bio: "" });
    }
  }, [editingAuthor]);

  const flashSuccess = (ms = 1800) => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), ms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic front-end validation
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setSaving(true);
    try {
      if (editingAuthor) {
        await request(`/authors/${editingAuthor.id}/`, {
          method: "PATCH",
          body: form,
        });
      } else {
        await request("/authors/", {
          method: "POST",
          body: form,
        });
      }

      flashSuccess();
      if (onSaved) onSaved();

      // reset form only for create mode
      if (!editingAuthor) {
        setForm({ name: "", email: "", bio: "" });
      }
    } catch (err) {
      // show friendly message; backend validation errors may be in err.data
      console.error("Save author failed", err);
      if (err && err.data) {
        // attempt to show first error message
        if (typeof err.data === "object") {
          const firstKey = Object.keys(err.data)[0];
          const msg = Array.isArray(err.data[firstKey]) ? err.data[firstKey][0] : err.data[firstKey];
          alert(msg || "Failed to save author");
        } else {
          alert(err.data || "Failed to save author");
        }
      } else {
        alert("Failed to save author");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">{editingAuthor ? "Edit Author" : "Add Author"}</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
            placeholder="Author name"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="optional email"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Short bio (optional)"
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {editingAuthor ? (saving ? "Saving..." : "Save changes") : (saving ? "Creating..." : "Create Author")}
          </button>

          {editingAuthor && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Saved successfully"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative z-10 w-80 max-w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-4 text-center">
              <svg
                className="mx-auto mb-2 h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-semibold">Saved successfully</h3>
              <p className="text-sm text-gray-600 mt-1">The author was saved.</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
