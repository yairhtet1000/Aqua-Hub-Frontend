import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
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

const EditPassword = () => {
  const { updateUser } = useAuth();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid w-[min(1000px,100%)] gap-5">
      <div className="rounded-4xl bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
        <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          Account settings
        </span>
        <h1 className="text-4xl font-black tracking-tight">Change password</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/settings/edit-profile"
          className={`${tabBase} ${tabInactive}`}
        >
          Edit Profile
        </a>
        <button
          type="button"
          className={`${tabBase} ${tabActive}`}
          disabled
        >
          Change Password
        </button>
      </div>

      <form
        className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950"
        onSubmit={handleSubmit}
      >
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
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <KeyRound size={18} />
          )}
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default EditPassword;
