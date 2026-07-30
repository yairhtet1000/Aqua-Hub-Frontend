import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Filter,
  Home,
  Moon,
  PenSquare,
  Search,
  Settings,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { categories, notifications, userById } from "../data/mockData";

const navLinkClass = ({ isActive }) =>
  [
    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition",
    isActive
      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
  ].join(" ");

const iconButtonClass =
  "grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white";

const AquaHubHeader = ({ currentUser, theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [],
  );

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query").trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
    setShowMobileSearch(false);
  };

  const goToCategory = (category) => {
    setShowTopics(false);
    navigate(category === "All" ? "/" : `/?category=${encodeURIComponent(category)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="grid min-h-16 w-full grid-cols-[240px_minmax(240px,680px)_1fr] items-center gap-6 px-4 sm:px-6 lg:px-8 max-lg:grid-cols-[auto_1fr_auto] max-lg:gap-3">
        <Link className="flex items-center gap-3 justify-self-start" to="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700 text-sm font-black text-white">
            Aq
          </span>
          <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white max-sm:hidden">
            AquaHub
          </span>
        </Link>

        <form
          className="mx-auto flex h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900 max-lg:hidden"
          onSubmit={handleSearch}
        >
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
            name="query"
            placeholder="Search AquaHub"
          />
        </form>

        <div className="relative flex items-center justify-end gap-2">
          <nav
            className="flex items-center gap-1 max-lg:hidden"
            aria-label="Primary navigation"
          >
            <NavLink className={navLinkClass} to="/" end>
              <Home size={17} />
              Feed
            </NavLink>
            <NavLink className={navLinkClass} to="/create-post">
              <PenSquare size={17} />
              Post
            </NavLink>
            <NavLink className={navLinkClass} to="/bookmarks">
              <Bookmark size={17} />
              Saved
            </NavLink>
            <NavLink className={navLinkClass} to="/following">
              <Users size={17} />
              Following
            </NavLink>
          </nav>

          <button
            className={`${iconButtonClass} lg:hidden`}
            onClick={() => setShowTopics((value) => !value)}
            title="Browse topics"
          >
            {showTopics ? <X size={18} /> : <Filter size={18} />}
          </button>

          <button
            className={`${iconButtonClass} lg:hidden`}
            onClick={() => setShowMobileSearch((value) => !value)}
            title="Search"
          >
            <Search size={18} />
          </button>

          <Link className={`${iconButtonClass} lg:hidden`} to="/create-post" title="Create post">
            <PenSquare size={18} />
          </Link>

          <button
            className="relative grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white max-lg:hidden"
            onClick={() => setShowNotifications((value) => !value)}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Account activity
                  </p>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    Notifications
                  </h2>
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-105 overflow-y-auto p-2">
                {notifications.map((item) => {
                  const actor = userById(item.actorId);
                  return (
                    <Link
                      className="grid grid-cols-[40px_1fr] gap-3 rounded-lg p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
                      key={item.id}
                      to={
                        item.postId
                          ? `/posts/${item.postId}`
                          : `/users/${actor.id}`
                      }
                      onClick={() => setShowNotifications(false)}
                    >
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={actor.avatar}
                        alt=""
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                          {actor.name}
                        </span>
                        <span className="block text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {item.text}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-400">
                          {item.unread && (
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                          )}
                          Account notification
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <button
            className={iconButtonClass}
            onClick={onToggleTheme}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white p-1 pr-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 max-lg:pr-1"
            to="/profile"
            title="Profile"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={currentUser.avatar}
              alt=""
            />
            <span className="max-lg:hidden">{currentUser.name}</span>
          </Link>

          <Link
            className={`${iconButtonClass} max-lg:hidden`}
            to="/settings"
            title="Settings"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {showMobileSearch && (
        <form
          className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 lg:hidden"
          onSubmit={handleSearch}
        >
          <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              autoFocus
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              name="query"
              placeholder="Search AquaHub"
            />
          </div>
        </form>
      )}

      {showTopics && (
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {["All", ...categories].map((category) => (
              <button
                className="h-10 rounded-lg bg-slate-100 px-3 text-left text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                key={category}
                onClick={() => goToCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default AquaHubHeader;
