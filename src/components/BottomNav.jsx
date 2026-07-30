import { NavLink } from "react-router-dom";
import { Bookmark, Home, Settings, UserRound, Users } from "lucide-react";

const items = [
  { to: "/", label: "Feed", icon: Home, end: true },
  { to: "/bookmarks", label: "Saved", icon: Bookmark },
  { to: "/following", label: "Following", icon: Users },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

const BottomNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            className={({ isActive }) =>
              [
                "grid h-14 place-items-center rounded-lg text-xs font-semibold transition",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white",
              ].join(" ")
            }
            end={end}
            key={to}
            to={to}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
