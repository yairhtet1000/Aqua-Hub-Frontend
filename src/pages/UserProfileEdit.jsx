import { useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import { useAuth, useToast } from "../hooks";
import api from "../api/axios";

const fieldClass =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass =
  "grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200";

const tabBase =
  "inline-flex h-11 min-w-36 items-center justify-center gap-2 rounded-full px-5 text-sm font-black transition";
const tabActive =
  "bg-teal-700 text-white shadow-lg shadow-teal-900/20";
const tabInactive =
  "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200";

const UserProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: null,
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: null,
      });
      setPreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const response = await api.post("/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.user || response.data;
      updateUser(updatedUser);
      addToast("Profile updated successfully.", "success");
    } catch {
      addToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid w-[min(1000px,100%)] gap-5">
      <div className="rounded-4xl bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
        <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          Account settings
        </span>
        <h1 className="text-4xl font-black tracking-tight">Edit profile</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={`${tabBase} ${tabActive}`}
          disabled
        >
          Edit Profile
        </button>
        <a
          href="/settings/edit-password"
          className={`${tabBase} ${tabInactive}`}
        >
          Change Password
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={preview || "https://via.placeholder.com/96"}
            alt=""
          />
          <label className="inline-flex h-11 min-w-56 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <Camera size={18} />
            Upload profile picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <label className={labelClass}>
            Name
            <input
              className={fieldClass}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label className={labelClass}>
            Phone
            <input
              className={fieldClass}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </div>
        <label className={labelClass}>
          Bio
          <textarea
            className="min-h-36 resize-y rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </label>
        <button
          className="inline-flex h-12 w-44 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
          type="submit"
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
