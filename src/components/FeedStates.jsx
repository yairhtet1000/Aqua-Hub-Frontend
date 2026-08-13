import { Bookmark, Loader2, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const skeletonBase = "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800";
const primaryActionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";

export const FeedSkeleton = ({ variant = "post" }) => {
  if (variant === "pulse") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
        <div className={`${skeletonBase} h-9 w-9`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className={`${skeletonBase} h-2.5 w-3/4`} />
          <div className={`${skeletonBase} h-2.5 w-1/2`} />
        </div>
        <div className={`${skeletonBase} h-7 w-10`} />
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`${skeletonBase} h-11 w-11 shrink-0`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className={`${skeletonBase} h-3 w-32`} />
          <div className={`${skeletonBase} h-2.5 w-24`} />
        </div>
      </div>
      <div className={`${skeletonBase} mt-5 h-5 w-4/5`} />
      <div className={`${skeletonBase} mt-3 h-3 w-full`} />
      <div className={`${skeletonBase} mt-2 h-3 w-3/4`} />
      <div className="mt-4 flex gap-2">
        <div className={`${skeletonBase} h-7 w-20`} />
        <div className={`${skeletonBase} h-7 w-24`} />
      </div>
      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className={`${skeletonBase} h-9 w-16`} />
        <div className={`${skeletonBase} h-9 w-20`} />
        <div className={`${skeletonBase} h-9 w-20`} />
      </div>
    </article>
  );
};

export const PageEmptyState = ({
  Icon = MessageSquarePlus,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) => (
  <div
    className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950"
    aria-live="polite"
  >
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
      <Icon size={20} aria-hidden="true" />
    </span>
    <h2 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">
      {title}
    </h2>
    <p className="mx-auto mt-2 max-w-md wrap-break-word text-sm leading-6 text-slate-500 dark:text-slate-400">
      {description}
    </p>
    {actionLabel &&
      (onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`${primaryActionClass} mt-5`}
        >
          {actionLabel}
        </button>
      ) : (
        <Link
          to={actionTo || "/create-post"}
          className={`${primaryActionClass} mt-5`}
        >
          {actionLabel}
        </Link>
      ))}
  </div>
);

export const FeedEmptyState = ({ query, category, onReset }) => {
  const isFiltered = Boolean(query || (category && category !== "All"));

  return (
    <PageEmptyState
      Icon={isFiltered ? Bookmark : MessageSquarePlus}
      title={
        isFiltered
          ? "No conversations match these filters"
          : "Start the first conversation"
      }
      description={
        isFiltered
          ? "Try another topic or clear the filters to see more aquarium advice."
          : "Share a question, tank journal, or helpful setup note with the AquaHub community."
      }
      actionLabel={isFiltered ? "Clear filters" : "Create a post"}
      actionTo={isFiltered ? undefined : "/create-post"}
      onAction={isFiltered ? onReset : undefined}
    />
  );
};

export const InlineLoading = ({ label = "Loading" }) => (
  <div className="flex items-center justify-center gap-2 py-12 text-sm font-medium text-slate-500 dark:text-slate-400">
    <Loader2
      size={18}
      className="animate-spin text-teal-700 dark:text-teal-300"
      aria-hidden="true"
    />
    {label}
  </div>
);
