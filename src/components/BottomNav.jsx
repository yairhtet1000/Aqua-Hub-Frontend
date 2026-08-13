import { Bookmark, Home, PlusCircle, UserRound, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Feed", icon: Home, end: true },
  { to: "/bookmarks", label: "Saved", icon: Bookmark },
  { to: "/create-post", label: "Post", icon: PlusCircle },
  { to: "/following", label: "Following", icon: Users },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const BottomNav = () => (
  <nav
    className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-2 py-2 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 md:hidden"
    aria-label="Mobile navigation"
  >
    <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              "grid min-h-14 place-items-center rounded-xl text-[11px] font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
            ].join(" ")
          }
        >
          <Icon size={17} className="mb-1" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
