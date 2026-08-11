const LoadingSpinner = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
        Loading...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
export { LoadingSpinner };
