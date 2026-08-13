import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth, useToast } from "../hooks";

const fieldClass =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass =
  "grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200";
const tabBase =
  "inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";
const tabActive = "bg-slate-900 text-white dark:bg-white dark:text-slate-950";
const tabInactive =
  "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900";

const EditPassword = () => {
  const { updateUser } = useAuth();
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.post("/user/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      updateUser(response.data.user || response.data);
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
    <div className="mx-auto grid w-full max-w-250 gap-5 px-4 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
          Account settings
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Change password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Use a strong password to keep your AquaHub account secure.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          className={`${tabBase} ${tabInactive}`}
          to="/settings/edit-profile"
        >
          Edit profile
        </Link>
        <button type="button" className={`${tabBase} ${tabActive}`} disabled>
          Change password
        </button>
      </div>

      <form
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:p-6"
        onSubmit={handleSubmit}
      >
        <label className={labelClass}>
          Current password
          <input
            className={fieldClass}
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          New password
          <input
            className={fieldClass}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
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
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        <button
          className="inline-flex min-h-11 w-48 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound size={17} aria-hidden="true" />
          )}
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default EditPassword;
