import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks";
import { ToastProvider } from "./contexts/ToastProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import CategoryManager from "./components/admin/CategoryManager";
import Overview from "./components/admin/Overview";
import ReportsManager from "./components/admin/ReportsManager";
import UserManager from "./components/admin/UserManager";
import AuthPage from "./pages/AuthPage";
import Bookmarks from "./pages/Bookmarks";
import Following from "./pages/Following";
import HomeFeed from "./pages/HomeFeed";
import PostDetail from "./pages/PostDetail";
import PostForm from "./pages/PostForm";
import Settings from "./pages/Settings";
import EditPassword from "./pages/EditPassword";
import UserProfile from "./pages/UserProfile";
import UserProfileEdit from "./pages/UserProfileEdit";
import AdminUserEdit from "./pages/admin/AdminUserEdit";
import AquaHubHeader from "./components/Header";
import BottomNav from "./components/BottomNav";

const THEME_KEY = "aquaHubTheme";

const PublicAppLayout = ({ theme, onToggleTheme }) => {
  const { user } = useAuth();

  return (
    <>
      <AquaHubHeader
        currentUser={user}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <main className="w-full px-4 pb-24 pt-5 sm:px-6 md:pb-5 lg:px-8">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
};

const AppRoutes = () => {
  const { user, loading, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <AuthPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <AuthPage mode="register" />}
          />
          <Route path="/admin/*" element={
              <AdminRoute>
                <AdminLayout
                  theme={theme}
                  onToggleTheme={() =>
                    setTheme((current) =>
                      current === "dark" ? "light" : "dark",
                    )
                  }
                />
              </AdminRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="reports" element={<ReportsManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="users/:id/edit" element={<AdminUserEdit />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="profile" element={<UserProfile own />} />
            <Route path="profile/edit-profile" element={<Settings section="profile" onLogout={logout} basePath="/admin/profile" />} />
            <Route path="profile/edit-password" element={<EditPassword />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <PublicAppLayout
                  theme={theme}
                  onToggleTheme={() =>
                    setTheme((current) =>
                      current === "dark" ? "light" : "dark",
                    )
                  }
                />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomeFeed />} />
            <Route path="/create-post" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
              path="/posts/:id/edit"
              element={<PostForm mode="edit" />}
            />
            <Route path="/profile" element={<UserProfile own />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route
              path="/settings"
              element={<Navigate to="/settings/edit-profile" replace />}
            />
            <Route
              path="/settings/edit-profile"
              element={<UserProfileEdit onLogout={logout} />}
            />
            <Route
              path="/settings/edit-password"
              element={<EditPassword />}
            />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/following" element={<Following />} />
            <Route path="/profile/network" element={<Navigate to="/following" replace />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);

export default App;
