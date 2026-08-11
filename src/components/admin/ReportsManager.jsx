import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  FileText,
  Filter,
  MessageSquare,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "dismissed", label: "Dismissed" },
];

const ReportsManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const { addToast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const response = await api.get("/admin/reports", { params });
      setReports(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch {
      addToast("Failed to load reports.", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, addToast, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDismiss = async (report) => {
    setActionLoading(report.id);
    try {
      await api.patch(`/admin/reports/${report.id}/status`, {
        status: "dismissed",
      });
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "dismissed" } : r,
        ),
      );
      addToast("Report dismissed successfully.", "success");
    } catch {
      addToast("Failed to dismiss report.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContent = async (report) => {
    setActionLoading(`delete-${report.id}`);
    try {
      await api.delete(`/admin/reports/${report.id}/resolve`);
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "reviewed" } : r,
        ),
      );
      addToast("Content deleted and report resolved.", "success");
    } catch {
      addToast("Failed to resolve report.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (report) => {
    setActionLoading(`ban-${report.id}`);
    try {
      await api.delete(`/admin/reports/${report.id}/ban-user`);
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "reviewed" } : r,
        ),
      );
      addToast("User has been banned.", "success");
    } catch {
      addToast("Failed to ban user.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const getReportableSnippet = (report) => {
    if (!report.reportable) return "Content not found";

    if (report.reportable_type === "App\\Models\\Post") {
      const title = report.reportable.title || "";
      const content = report.reportable.content || "";
      const text = title || content;
      return text.length > 120 ? text.slice(0, 120) + "..." : text;
    }

    if (report.reportable_type === "App\\Models\\Comment") {
      const content = report.reportable.content || "";
      return content.length > 120 ? content.slice(0, 120) + "..." : content;
    }

    return "Unknown content type";
  };

  const getReportableIcon = (type) => {
    if (type === "App\\Models\\Post") return FileText;
    if (type === "App\\Models\\Comment") return MessageSquare;
    return AlertTriangle;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
      reviewed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
      dismissed: "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[status] || styles.pending}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="mx-auto w-[min(1200px,100%)] grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            Reports Queue
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and take action on reported content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search reports..."
              className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchReports}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <ShieldCheck size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-semibold">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Reporter
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Target Type
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Reason
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Content Snippet
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((report) => {
                  const ReportableIcon = getReportableIcon(report.reportable_type);
                  return (
                    <tr
                      key={report.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-950 dark:text-white">
                              {report.user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {report.user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ReportableIcon size={16} className="text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {report.reportable_type === "App\\Models\\Post"
                              ? "Post"
                              : report.reportable_type === "App\\Models\\Comment"
                                ? "Comment"
                                : "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate text-slate-600 dark:text-slate-300">
                          {report.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="max-w-xs truncate text-slate-500 dark:text-slate-400">
                          {getReportableSnippet(report)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {report.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleDismiss(report)}
                                disabled={actionLoading === report.id}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                                title="Dismiss report"
                              >
                                <XCircle size={14} />
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleDeleteContent(report)}
                                disabled={actionLoading === `delete-${report.id}`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
                                title="Delete reported content"
                              >
                                {actionLoading === `delete-${report.id}` ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-700 border-t-transparent" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                                Delete Content
                              </button>
                              <button
                                onClick={() => handleBanUser(report)}
                                disabled={actionLoading === `ban-${report.id}`}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                                title="Ban reported user"
                              >
                                {actionLoading === `ban-${report.id}` ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />
                                ) : (
                                  <User size={14} />
                                )}
                                Ban User
                              </button>
                            </>
                          )}
                          {report.status !== "pending" && (
                            <span className="text-xs text-slate-400">
                              No actions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManager;
