import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Avatar from "./Avatar";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referenceTime] = useState(() => Date.now());
  const containerRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.data || response.data || []);
    } catch {
      // Notifications are helpful context, but should not block the app shell.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const unreadCount = notifications.filter((notification) => !notification.read_at).length;

  const handleMarkRead = async (event, notificationId) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification,
        ),
      );
    } catch {
      // Keep the notification visible if the request fails.
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read_at: new Date().toISOString(),
        })),
      );
    } catch {
      // Keep the current unread state if the request fails.
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const seconds = Math.floor((referenceTime - date.getTime()) / 1000);
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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell size={17} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-950" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-13 z-50 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Account activity
              </p>
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="min-h-9 rounded-lg bg-slate-100 px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Mark all read
                </button>
              )}
              <span className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-200">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="max-h-105 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 size={18} className="animate-spin text-teal-700 dark:text-teal-300" />
                Loading notifications
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const data = notification.data || {};
                const senderName = data.sender_name || "Someone";
                const postId = data.post_id || notification.data?.post_id;
                const message = data.message || "New notification";

                return (
                  <div
                    className={`relative ${!notification.read_at ? "bg-teal-50/50 dark:bg-teal-950/20" : ""}`}
                    key={notification.id}
                  >
                    <Link
                      to={postId ? `/posts/${postId}` : "/"}
                      onClick={() => setOpen(false)}
                      className="grid min-h-16 grid-cols-[40px_minmax(0,1fr)] gap-3 p-3 pr-12 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 dark:hover:bg-slate-900"
                    >
                      <Avatar src={data.sender_avatar} alt={`${senderName} avatar`} sizeClass="h-10 w-10" shapeClass="rounded-lg" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-slate-950 dark:text-white">
                          {senderName}
                        </span>
                        <span className="block break-words text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {message}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-400">
                          {!notification.read_at && <span className="h-2 w-2 rounded-full bg-teal-500" />}
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </span>
                    </Link>
                    {!notification.read_at && (
                      <button
                        type="button"
                        onClick={(event) => handleMarkRead(event, notification.id)}
                        className="absolute right-2 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-500 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-950 dark:text-slate-400 dark:hover:text-teal-300"
                        title="Mark as read"
                        aria-label={`Mark notification from ${senderName} as read`}
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
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
