import { useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../hooks/useToast";

const ReportModal = ({
  isOpen,
  onClose,
  reportableId,
  reportableType = "App\\Models\\Post",
}) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      addToast("Please provide a reason for the report.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reports", {
        reportable_type: reportableType,
        reportable_id: reportableId,
        reason: reason.trim(),
      });

      addToast("Report submitted successfully. Thank you.", "success");
      setReason("");
      onClose?.();
    } catch {
      addToast("Failed to submit report. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[min(420px,100%)] rounded-4xl border border-white bg-white p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-rose-600" />
            <h3 className="text-lg font-black text-slate-950 dark:text-white">
              Report Content
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Help us keep AquaHub safe. Please describe why this content violates
          our guidelines.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
            Reason
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Spam, harassment, inappropriate content, etc."
              className="min-h-32 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm focus:outline-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-black text-white shadow-lg shadow-rose-900/20 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Flag size={16} />
              )}
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
