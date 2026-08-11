import { useEffect, useState, useCallback } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data || response.data || []);
    } catch {
      // silent fail for notifications
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleToggle = async () => {
    setOpen((prev) => !prev);
  };

  const handleMarkRead = async (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch {
      // silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch {
      // silent fail
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        className="relative grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
        onClick={handleToggle}
        title="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 z-50">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Account activity
              </p>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Mark all read
                </button>
              )}
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="max-h-105 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-teal-700" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const data = notification.data || {};
                const senderName = data.sender_name || "Someone";
                const senderAvatar = data.sender_avatar;
                const postId = data.post_id || notification.data?.post_id;
                const message = data.message || "New notification";

                return (
                  <Link
                    to={postId ? `/posts/${postId}` : "#"}
                    onClick={() => setOpen(false)}
                    className={`grid grid-cols-[40px_1fr] gap-3 p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900 ${
                      !notification.read_at ? "bg-slate-50/80 dark:bg-slate-900/40" : ""
                    }`}
                    key={notification.id}
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={getImageUrl(senderAvatar)}
                      alt=""
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                        {senderName}
                      </span>
                      <span className="block text-sm leading-5 text-slate-600 dark:text-slate-300">
                        {message}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-400">
                        {!notification.read_at && (
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                        )}
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </span>
                    {!notification.read_at && (
                      <button
                        onClick={(e) => handleMarkRead(e, notification.id)}
                        className="absolute right-2 top-2 rounded-md bg-white p-1 text-xs font-bold text-slate-500 hover:text-teal-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-teal-300"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
