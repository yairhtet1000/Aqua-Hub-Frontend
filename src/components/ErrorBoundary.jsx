import { Component } from "react";

const DEFAULT_FALLBACK = (
  <div className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-slate-950">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-black text-slate-950 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        We hit an unexpected error. Please refresh the page or return home.
      </p>
      <pre className="mt-4 rounded-xl bg-slate-100 p-4 text-left text-xs text-rose-600 dark:bg-slate-900 dark:text-rose-400">
        {typeof window !== "undefined" && window.__APP_ERROR__?.message
          ? window.__APP_ERROR__.message
          : "Unknown error"}
      </pre>
      <button
        onClick={() => {
          window.__APP_ERROR__ = null;
          window.location.href = "/";
        }}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-black text-white shadow-lg shadow-teal-900/20"
      >
        Return Home
      </button>
    </div>
  </div>
);

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    if (typeof window !== "undefined") {
      window.__APP_ERROR__ = { message: error.message };
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? DEFAULT_FALLBACK;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
