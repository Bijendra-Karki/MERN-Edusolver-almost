"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PlusCircle, Loader2, Trash2, Edit2, Zap, XCircle, CheckCircle2 } from "lucide-react";
import { getToken } from "../../components/utils/authHelper";

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
const DEFAULT_COLOR = "#8B5CF6"; // violet-500
const generateMockId = () => Math.random().toString(36).substring(2, 9);

// -----------------------------------------------------------
// 1️⃣ Category Form (Create)
// -----------------------------------------------------------
function CategoryForm({ onAddCategory, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "✨",
    color: DEFAULT_COLOR,
    courseCount: 0,
  });

  useEffect(() => {
    if (formData.name) {
      const newSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    } else {
      setFormData((prev) => ({ ...prev, slug: "" }));
    }
  }, [formData.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "courseCount" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;
    onAddCategory(formData);
    setFormData({ name: "", slug: "", icon: "✨", color: DEFAULT_COLOR, courseCount: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-violet-600 mb-6 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" /> Create New Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Category Name *" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
        <Input label="Slug *" name="slug" value={formData.slug} onChange={handleChange} disabled readOnly />
        <Input label="Icon (Emoji)" name="icon" value={formData.icon} onChange={handleChange} maxLength={2} />
        <ColorInput label="Color" name="color" value={formData.color} onChange={handleChange} />
        <Input label="Course Count" type="number" name="courseCount" value={formData.courseCount} onChange={handleChange} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full md:w-auto px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition shadow-md shadow-violet-200 disabled:bg-violet-400 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Category"}
      </button>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition disabled:bg-gray-50"
      />
    </div>
  );
}

function ColorInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" name={name} value={value} onChange={onChange} className="w-16 h-10 border rounded-lg cursor-pointer" />
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// 2️⃣ Category Cards (Read + Delete + Edit Trigger)
// -----------------------------------------------------------
function CategoryCards({ categories, onDeleteCategory, onEditCategory, isDeleting }) {
  if (!categories.length) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-md">
        <p className="text-gray-500 text-lg">No categories yet. Create one to get started 🚀</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div key={category._id || category.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:scale-[1.02] transition">
          <div className="p-5 flex items-center gap-4 border-b" style={{ backgroundColor: `${category.color}20` }}>
            <div className="w-14 h-14 flex items-center justify-center rounded-full text-white shadow-md" style={{ backgroundColor: category.color }}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
          </div>
          <div className="p-5 flex flex-col gap-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Slug:</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">{category.slug}</code>
            </div>
            <div className="flex justify-between">
              <span>Courses:</span>
              <span className="font-semibold text-violet-600 flex items-center gap-1">
                <Zap size={14} /> {category.courseCount}
              </span>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => onEditCategory(category)}
                className="flex-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 flex items-center justify-center gap-1"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => onDeleteCategory(category._id || category.id)}
                disabled={isDeleting === category._id}
                className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isDeleting === category._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={14} />} Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------------
// 3️⃣ Edit Modal (Update)
// -----------------------------------------------------------
function EditModal({ category, onClose, onSave, isUpdating }) {
  const [form, setForm] = useState({ ...category });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
        <h3 className="text-lg font-bold text-violet-600">Edit Category</h3>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Slug" name="slug" value={form.slug} onChange={handleChange} />
        <Input label="Icon (Emoji)" name="icon" value={form.icon} onChange={handleChange} maxLength={2} />
        <ColorInput label="Color" name="color" value={form.color} onChange={handleChange} />
        <Input label="Course Count" name="courseCount" type="number" value={form.courseCount} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-1">
            <XCircle size={16} /> Cancel
          </button>
          <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-1">
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 size={16} />} Save
          </button>
        </div>
      </form>
    </div>
  );
}

// -----------------------------------------------------------
// 4️⃣ Main Component (CRUD Logic)
// -----------------------------------------------------------
export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const token = getToken();
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/categories/categoryList", axiosConfig);
      const data = Array.isArray(res.data) ? res.data : res.data.categories;
      setCategories(data.map((c) => ({ ...c, id: c._id || generateMockId() })));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleAdd = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/categories/createCategory", data, axiosConfig);
      fetchCategories();
    } catch (err) {
      alert("Error adding category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setIsDeleting(id);
    try {
      await axios.delete(`/api/categories/deleteCategory/${id}`, axiosConfig);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Error deleting category.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = async (updated) => {
    setIsUpdating(true);
    try {
      await axios.put(`/api/categories/updateCategory/${updated._id}`, updated, axiosConfig);
      setEditing(null);
      fetchCategories();
    } catch {
      alert("Error updating category.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="border-b pb-4">
          <h1 className="text-4xl font-bold text-violet-700">Category Dashboard</h1>
          <p className="text-gray-600">Manage all course categories below.</p>
        </header>

        <CategoryForm onAddCategory={handleAdd} isSubmitting={isSubmitting} />

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
          {loading ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <Loader2 className="w-6 h-6 animate-spin text-violet-600 mx-auto" />
              <p className="text-gray-600 mt-2">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border">{error}</div>
          ) : (
            <CategoryCards categories={categories} onDeleteCategory={handleDelete} onEditCategory={setEditing} isDeleting={isDeleting} />
          )}
        </section>

        {editing && <EditModal category={editing} onClose={() => setEditing(null)} onSave={handleUpdate} isUpdating={isUpdating} />}
      </div>
    </div>
  );
}
