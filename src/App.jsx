import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import AquaHubHeader from "./components/Header";
import AuthPage from "./pages/AuthPage";
import Bookmarks from "./pages/Bookmarks";
import Following from "./pages/Following";
import HomeFeed from "./pages/HomeFeed";
import PostDetail from "./pages/PostDetail";
import PostForm from "./pages/PostForm";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import { currentUser } from "./data/mockData";

const AUTH_KEY = "aquaHubUser";
const THEME_KEY = "aquaHubTheme";

const AppRoutes = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : currentUser;
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
  }, [user]);

  const handleLogin = () => {
    setUser(currentUser);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" onLogin={handleLogin} />} />
        <Route path="/register" element={<AuthPage mode="register" onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <AquaHubHeader
        currentUser={user}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
      />
      <main className="w-full px-4 pb-24 pt-5 sm:px-6 md:pb-5 lg:px-8">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/create-post" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostForm mode="edit" />} />
          <Route path="/profile" element={<UserProfile own />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
          <Route path="/settings/profile" element={<Settings section="profile" onLogout={handleLogout} />} />
          <Route path="/settings/password" element={<Settings section="password" onLogout={handleLogout} />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/following" element={<Following />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
