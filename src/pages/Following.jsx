import { useEffect, useState, useCallback } from "react";
import { UsersRound, UserCheck, UserPlus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks";
import { useToast } from "../hooks";
import { getImageUrl } from "../utils/imageUrl";

const Following = () => {
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("following");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "following"
          ? `/users/${authUser?.id}/following`
          : `/users/${authUser?.id}/followers`;
      const { data } = await api.get(endpoint, { params: { page: 1 } });
      setUsers(data.data || []);
    } catch {
      addToast("Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab, authUser?.id, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollowToggle = async (targetUser) => {
    if (actionLoading) return;
    const previousUsers = [...users];
    const optimisticFollowing = !targetUser.is_following;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, is_following: optimisticFollowing } : u,
      ),
    );
    setActionLoading(targetUser.id);

    try {
      const endpoint = optimisticFollowing
        ? `/users/${targetUser.id}/follow`
        : `/users/${targetUser.id}/unfollow`;
      const { data } = await api[optimisticFollowing ? "post" : "delete"](endpoint);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id ? { ...u, is_following: data.is_following } : u,
        ),
      );
      addToast(data.message, "success");
    } catch {
      setUsers(previousUsers);
      addToast("Failed to update follow status.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { key: "following", label: "Following", icon: UserCheck },
    { key: "followers", label: "Followers", icon: UsersRound },
  ];

  return (
    <section className="mx-auto grid w-[min(860px,100%)] gap-5">
      <div className="rounded-4xl bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
        <span className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          <UsersRound size={17} />
          Community network
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tight">Network</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-black transition ${
                activeTab === tab.key
                  ? "border-teal-700 text-teal-700 dark:text-teal-300"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={17} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          No {activeTab} yet.
        </div>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950 max-sm:grid-cols-[56px_1fr]"
            >
              <img
                className="h-14 w-14 rounded-full object-cover"
                src={getImageUrl(u.avatar) || "https://via.placeholder.com/56"}
                alt=""
              />
              <div className="min-w-0">
                <strong className="block text-lg font-black text-slate-950 dark:text-white">
                  {u.name}
                </strong>
                <p className="line-clamp-2 leading-6 text-slate-600 dark:text-slate-300">{u.bio}</p>
              </div>
              {u.id !== authUser?.id && (
                <button
                  onClick={() => handleFollowToggle(u)}
                  disabled={actionLoading === u.id}
                  className={`inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition disabled:opacity-60 ${
                    u.is_following
                      ? "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                      : "bg-teal-700 text-white shadow-lg shadow-teal-900/20"
                  }`}
                >
                  {actionLoading === u.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : u.is_following ? (
                    "Following"
                  ) : activeTab === "followers" ? (
                    <>
                      <UserPlus size={17} />
                      Follow Back
                    </>
                  ) : (
                    <>
                      <UserPlus size={17} />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Following;
