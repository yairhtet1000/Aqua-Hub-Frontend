import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const FollowModal = ({ isOpen, onClose, type, userId, title }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = type === "followers" ? `/users/${userId}/followers` : `/users/${userId}/following`;
        const response = await api.get(endpoint, { params: { page } });
        const data = response.data;
        setUsers(data.data || []);
        setTotalPages(data.last_page || 1);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userId, type, page]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[min(480px,100%)] max-h-[80vh] overflow-hidden rounded-4xl border border-white bg-white p-0 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-950 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-teal-700" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No users found.
            </div>
          ) : (
            <div className="grid gap-3">
              {users.map((u) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
                  key={u.id}
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={getImageUrl(u.avatar) || "https://via.placeholder.com/40"}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{u.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">@{u.name?.replace(/\s/g, "_").toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-6 py-3 dark:border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowModal;
