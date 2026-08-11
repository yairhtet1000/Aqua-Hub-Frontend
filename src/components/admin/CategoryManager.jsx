import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page };
      if (search.trim()) {
        params.search = search.trim();
      }
      const response = await api.get("/categories", { params });
      const data = response.data;
      setCategories(data.data || []);
      setTotalPages(data.last_page || 1);
    } catch {
      addToast("Failed to load categories.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormError("");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setFormError("");
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        });
        addToast("Category updated successfully.", "success");
      } else {
        await api.post("/admin/categories", {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
        });
        addToast("Category created successfully.", "success");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.name?.[0] ||
        `Failed to ${editingCategory ? "update" : "create"} category.`;
      setFormError(message);
      addToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/categories/${category.id}`);
      addToast("Category deleted successfully.", "success");
      fetchCategories();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to delete category. It may have assigned posts.";
      addToast(message, "error");
    }
  };

  return (
    <div className="mx-auto w-[min(1200px,100%)] grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            Category Manager
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage post categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search categories..."
              className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-black text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800"
          >
            <Plus size={16} />
            New Category
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <p className="text-sm font-semibold">No categories yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Name
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Description
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Posts
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-950 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {category.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {category.posts_count ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-[min(480px,100%)] rounded-4xl border border-white bg-white p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={closeModal}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                Category Name
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Freshwater"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                Description
                <input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
                >
                  {saving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : editingCategory ? (
                    "Save Changes"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
