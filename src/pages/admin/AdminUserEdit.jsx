import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    role_id: "",
    status: "active",
    force_email_change: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, rolesRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get("/admin/roles"),
        ]);
        const user = userRes.data.user || userRes.data;
        setFormData({
          role_id: user.role?.id || "",
          status: user.status || "active",
          force_email_change: user.force_email_change || false,
        });
        setRoles(rolesRes.data || []);
      } catch {
        addToast("Failed to load user.", "error");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, addToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/users/${id}`, {
        role_id: formData.role_id ? parseInt(formData.role_id, 10) : null,
        status: formData.status,
        force_email_change: formData.force_email_change,
      });
      addToast("User updated successfully.", "success");
      navigate("/admin/users");
    } catch {
      addToast("Failed to update user.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-[min(1000px,100%)] gap-5">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">
            Edit User
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage role, status, and account requirements.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <label className="grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Role
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <input
            type="checkbox"
            name="force_email_change"
            checked={formData.force_email_change}
            onChange={handleChange}
            className="h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
          />
          <div>
            <span className="block text-sm font-black text-slate-700 dark:text-slate-200">
              Force email change on next login
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              User will be prompted to update their email address.
            </span>
          </div>
        </label>

        <button
          className="inline-flex h-12 w-44 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
          type="submit"
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminUserEdit;
