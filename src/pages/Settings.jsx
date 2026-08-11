import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, KeyRound, LogOut, Save } from "lucide-react";
import { useAuth, useToast } from "../hooks";
import api from "../api/axios";

const fieldClass =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass = "grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200";

const Settings = ({ section = "profile", onLogout }) => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const passwordSection = section === "password";

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: null,
  });
  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    try {
      const response = await api.post("/user/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      const updatedUser = response.data.user || response.data;
      updateUser(updatedUser);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast("Password updated successfully.", "success");
    } catch {
      addToast("Failed to update password.", "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="mx-auto grid w-[min(1000px,100%)] grid-cols-[230px_minmax(0,1fr)] gap-5 max-md:grid-cols-1">
      <aside className="sticky top-24 grid self-start gap-4 max-md:static">
        <div className="grid rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
          <Link
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              !passwordSection
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
            to="/settings/profile"
          >
            Edit profile
          </Link>
          <Link
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              passwordSection
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
            to="/settings/password"
          >
            Change password
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">Account</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Sign out from this browser when you are done managing your account.
          </p>
          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <section className="grid gap-5">
        <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
          <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
            Account settings
          </span>
          <h1 className="text-4xl font-black tracking-tight">
            {passwordSection ? "Change password" : "Edit profile"}
          </h1>
        </div>

        {passwordSection ? (
          <form className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950" onSubmit={handlePasswordSubmit}>
            <label className={labelClass}>
              Current password
              <input
                className={fieldClass}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>
            <label className={labelClass}>
              New password
              <input
                className={fieldClass}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <label className={labelClass}>
              Confirm new password
              <input
                className={fieldClass}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <button
              className="inline-flex h-12 w-48 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
              type="submit"
              disabled={passwordSaving}
            >
              <KeyRound size={18} />
              {passwordSaving ? "Updating..." : "Update password"}
            </button>
          </form>
        ) : (
          <form className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950" onSubmit={handleSubmit}>
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
        )}
      </section>
    </div>
  );
};

export default Settings;
