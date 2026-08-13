import { useCallback, useEffect, useState } from "react";
import { UserCheck, UserPlus, UsersRound } from "lucide-react";
import api from "../api/axios";
import Avatar from "../components/Avatar";
import { InlineLoading, PageEmptyState } from "../components/FeedStates";
import { useAuth, useToast } from "../hooks";

const Following = () => {
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("following");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const authUserId = authUser?.id;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "following"
          ? `/users/${authUserId}/following`
          : `/users/${authUserId}/followers`;
      const { data } = await api.get(endpoint, { params: { page: 1 } });
      setUsers(data.data || []);
    } catch {
      addToast("Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab, authUserId, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollowToggle = async (targetUser) => {
    if (actionLoading) return;
    const previousUsers = [...users];
    const optimisticFollowing = !targetUser.is_following;

    setUsers((previous) =>
      previous.map((user) =>
        user.id === targetUser.id
          ? { ...user, is_following: optimisticFollowing }
          : user,
      ),
    );
    setActionLoading(targetUser.id);

    try {
      const endpoint = optimisticFollowing
        ? `/users/${targetUser.id}/follow`
        : `/users/${targetUser.id}/unfollow`;
      const { data } =
        await api[optimisticFollowing ? "post" : "delete"](endpoint);
      setUsers((previous) =>
        previous.map((user) =>
          user.id === targetUser.id
            ? { ...user, is_following: data.is_following }
            : user,
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
    <section className="mx-auto grid w-full max-w-215 gap-5 px-4 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
          Community network
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Network
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Keep up with the aquarists and tank journals you trust.
        </p>
      </header>

      <div
        className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800"
        role="tablist"
        aria-label="Network views"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                isActive
                  ? "border-teal-700 text-teal-700 dark:text-teal-300"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <InlineLoading label={`Loading ${activeTab}`} />
      ) : users.length === 0 ? (
        <PageEmptyState
          Icon={UsersRound}
          title={`No ${activeTab} yet`}
          description="Follow an aquarist from the feed to build a useful community network."
          actionLabel="Browse feed"
          actionTo="/"
        />
      ) : (
        <div className="grid gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-[48px_minmax(0,1fr)_auto]"
            >
              <Avatar
                src={user.avatar}
                alt={`${user.name || "User"} avatar`}
                sizeClass="h-12 w-12"
                shapeClass="rounded-xl"
              />
              <div className="min-w-0">
                <strong className="block truncate font-display text-base font-bold text-slate-950 dark:text-white">
                  {user.name}
                </strong>
                <p className="mt-1 wrap-break-word text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {user.bio || "AquaHub community member"}
                </p>
              </div>
              {user.id !== authUser?.id && (
                <button
                  type="button"
                  onClick={() => handleFollowToggle(user)}
                  disabled={actionLoading === user.id}
                  aria-pressed={user.is_following}
                  className={`col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 ${
                    user.is_following
                      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      : "bg-teal-700 text-white shadow-sm shadow-teal-700/20 hover:bg-teal-800"
                  }`}
                >
                  {actionLoading === user.id ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : user.is_following ? (
                    "Following"
                  ) : (
                    <>
                      <UserPlus size={16} aria-hidden="true" />
                      {activeTab === "followers" ? "Follow back" : "Follow"}
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
