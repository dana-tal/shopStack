import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin } = useSelector((state) => state.auth);

  // Not logged in → redirect to login
  if (!isLoggedIn) return <Navigate to="/auth/login" replace />;

  // Admin-only route → block non-admins
  if (adminOnly && !isAdmin) return <Navigate to="/store/products" replace />;

  return children; // user is authorized
}

export default ProtectedRoute;
