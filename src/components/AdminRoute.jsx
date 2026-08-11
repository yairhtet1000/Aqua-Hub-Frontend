import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { LoadingSpinner } from "./LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user?.role?.name === "Admin" || user?.role?.name === "Moderator";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
