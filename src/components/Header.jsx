import { useState } from "react";
import { Bookmark, Home, Moon, PenSquare, Search, Sun, Users } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import Avatar from "./Avatar";

const navLinkClass = ({ isActive }) =>
  [
    "inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
    isActive
      ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
  ].join(" ");

const iconButtonClass =
  "grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white";

const AquaHubHeader = ({ currentUser, theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.trim() || "";
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
    setShowMobileSearch(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid min-h-[72px] w-full max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[220px_minmax(300px,1fr)_auto] lg:gap-8 lg:px-8">
        <Link
          className="flex min-h-11 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          to="/"
          aria-label="AquaHub home"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-700 font-display text-sm font-extrabold text-white shadow-sm shadow-teal-700/20">
            Aq
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-950 dark:text-white max-sm:hidden">
            AquaHub
          </span>
        </Link>

        <form
          className="hidden h-11 min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 md:flex lg:max-w-[560px]"
          onSubmit={handleSearch}
          role="search"
        >
          <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
            name="query"
            aria-label="Search AquaHub"
            placeholder="Search questions, fish, or tags"
          />
          <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-900 lg:inline">
            ⌘ K
          </kbd>
        </form>

        <div className="flex items-center justify-end gap-2">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            <NavLink className={navLinkClass} to="/" end>
              <Home size={16} aria-hidden="true" />
              Feed
            </NavLink>
            <NavLink className={navLinkClass} to="/create-post">
              <PenSquare size={16} aria-hidden="true" />
              Post
            </NavLink>
            <NavLink className={navLinkClass} to="/bookmarks">
              <Bookmark size={16} aria-hidden="true" />
              Saved
            </NavLink>
            <NavLink className={navLinkClass} to="/following">
              <Users size={16} aria-hidden="true" />
              Following
            </NavLink>
          </nav>

          <button
            type="button"
            className={`${iconButtonClass} md:hidden`}
            onClick={() => setShowMobileSearch((value) => !value)}
            aria-label={showMobileSearch ? "Close search" : "Search"}
            aria-expanded={showMobileSearch}
          >
            <Search size={17} aria-hidden="true" />
          </button>

          <NotificationDropdown />

          <button
            type="button"
            className={iconButtonClass}
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>

          <Link
            className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 pr-3 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 max-sm:pr-1"
            to="/profile"
            aria-label="Open profile"
          >
            <Avatar src={currentUser?.avatar} alt={`${currentUser?.name || "Your"} profile`} sizeClass="h-9 w-9" />
            <span className="hidden max-w-28 truncate text-sm font-bold text-slate-800 dark:text-slate-100 sm:block">
              {currentUser?.name || "Profile"}
            </span>
          </Link>
        </div>
      </div>

      {showMobileSearch && (
        <form
          className="border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden"
          onSubmit={handleSearch}
          role="search"
        >
          <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900">
            <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              name="query"
              aria-label="Search AquaHub"
              placeholder="Search questions, fish, or tags"
            />
          </div>
        </form>
      )}
    </header>
  );
};

export default AquaHubHeader;
