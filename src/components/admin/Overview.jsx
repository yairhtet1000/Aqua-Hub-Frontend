import { useEffect, useState, useCallback } from "react";
import { Users, FileText, ShieldCheck, AlertTriangle } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const statCardClass =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950";

const Overview = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    reports: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, reportsRes, categoriesRes] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/posts"),
          api.get("/admin/reports"),
          api.get("/categories"),
        ]);

      setStats({
        users: usersRes.data.total || usersRes.data.data?.length || 0,
        posts: postsRes.data.total || postsRes.data.data?.length || 0,
        reports: reportsRes.data.total || reportsRes.data.data?.length || 0,
        categories: categoriesRes.data.data?.length || 0,
      });
    } catch {
      addToast("Failed to load dashboard stats.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const items = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-teal-700 bg-teal-50 dark:text-teal-200 dark:bg-teal-950",
    },
    {
      label: "Total Posts",
      value: stats.posts,
      icon: FileText,
      color: "text-sky-700 bg-sky-50 dark:text-sky-200 dark:bg-sky-950",
    },
    {
      label: "Pending Reports",
      value: stats.reports,
      icon: AlertTriangle,
      color: "text-amber-700 bg-amber-50 dark:text-amber-200 dark:bg-amber-950",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: ShieldCheck,
      color: "text-rose-700 bg-rose-50 dark:text-rose-200 dark:bg-rose-950",
    },
  ];

  return (
    <div className="mx-auto w-[min(1200px,100%)] grid gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform health at a glance.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className={statCardClass}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`grid h-12 w-12 place-items-center rounded-xl ${item.color}`}
                >
                  <item.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;
