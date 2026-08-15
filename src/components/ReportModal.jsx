import { useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../hooks/useToast";

const fieldClass =
  "min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

const ReportModal = ({
  isOpen,
  onClose,
  onReportSubmitted,
  reportableId,
  reportableType = "App\\Models\\Post",
}) => {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      onReportSubmitted?.();
    } catch {
      addToast("Failed to submit report. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close report dialog"
      />
      <div
        className="relative w-[min(420px,100%)] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flag size={18} className="text-rose-600" aria-hidden="true" />
            <h2
              id="report-dialog-title"
              className="font-display text-lg font-bold text-slate-950 dark:text-white"
            >
              Report content
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-400 dark:hover:bg-slate-900"
            aria-label="Close report dialog"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Help us keep AquaHub safe. Please describe why this content violates
          our guidelines.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label
            className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"
            htmlFor="report-reason"
          >
            Reason
            <textarea
              id="report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Spam, harassment, inappropriate content, etc."
              className={fieldClass}
              required
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 min-w-32 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Flag size={16} aria-hidden="true" />
              )}
              {submitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
