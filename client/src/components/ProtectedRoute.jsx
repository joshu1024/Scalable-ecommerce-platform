import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
