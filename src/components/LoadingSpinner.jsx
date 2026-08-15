import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <Loader2
        size={28}
        className="animate-spin text-teal-700 dark:text-teal-300"
        aria-hidden="true"
      />
      <p className="font-display text-sm font-bold text-slate-500 dark:text-slate-400">
        Loading AquaHub
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
export { LoadingSpinner };
