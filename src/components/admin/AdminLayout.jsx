import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks";
import NotificationDropdown from "../../components/NotificationDropdown";

const navItems = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/reports", icon: ShieldCheck, label: "Reports Queue" },
  { to: "/admin/users", icon: Users, label: "User Management" },
  { to: "/admin/categories", icon: FolderTree, label: "Category Manager" },
];

const linkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-teal-700 text-white shadow-lg shadow-teal-900/20"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
  ].join(" ");

const AdminLayout = ({ theme, onToggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-teal-700 to-cyan-500 text-sm font-black text-white">
                  Aq
                </span>
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">
                    AquaHub
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Admin Panel
                  </p>
                </div>
              </div>
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Management
              </p>
              <div className="grid gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={linkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <NavLink
                to="/admin/profile"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 text-sm font-black text-teal-700 dark:bg-teal-900 dark:text-teal-200">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.role?.name || "Administrator"}
                  </p>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>
              <h1 className="text-lg font-black text-slate-950 dark:text-white lg:text-xl">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <NotificationDropdown />
                <button
                  onClick={onToggleTheme}
                  className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <span className="hidden sm:inline">
                  {user?.role?.name || "Administrator"}
                </span>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
