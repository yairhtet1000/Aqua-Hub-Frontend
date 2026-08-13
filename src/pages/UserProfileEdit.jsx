import { useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth, useToast } from "../hooks";
import SafeImage from "../components/SafeImage";
import { getImageUrl } from "../utils/imageUrl";

const fieldClass =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass = "grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200";
const tabBase =
  "inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";
const tabActive = "bg-slate-900 text-white dark:bg-white dark:text-slate-950";
const tabInactive =
  "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900";

const UserProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "", avatar: null });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: null,
    });
    setPreview(user.avatar || "");
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((previous) => ({ ...previous, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("bio", formData.bio);
      if (formData.avatar) data.append("avatar", formData.avatar);

      const response = await api.post("/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(response.data.user || response.data);
      addToast("Profile updated successfully.", "success");
    } catch {
      addToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = preview.startsWith("blob:") ? preview : getImageUrl(preview);

  return (
    <div className="mx-auto grid w-full max-w-[1000px] gap-5 px-4 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">Account settings</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Edit profile</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Keep your community profile useful to other aquarists.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={`${tabBase} ${tabActive}`} disabled>Edit profile</button>
        <Link className={`${tabBase} ${tabInactive}`} to="/settings/edit-password">Change password</Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
          <SafeImage className="h-24 w-24 rounded-2xl object-cover" src={previewSrc} alt={`${user?.name || "Your"} profile preview`} fallbackSrc="/default-avatar.png" />
          <label className="inline-flex min-h-11 min-w-56 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-teal-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
            <Camera size={17} aria-hidden="true" />
            Upload profile picture
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Name
            <input className={fieldClass} name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label className={labelClass}>
            Phone
            <input className={fieldClass} name="phone" value={formData.phone} onChange={handleChange} />
          </label>
        </div>
        <label className={labelClass}>
          Bio
          <textarea className="min-h-36 resize-y rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100" name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <button className="inline-flex min-h-11 w-44 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving}>
          <Save size={17} aria-hidden="true" />
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
