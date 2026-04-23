import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore'; // adjust path if needed

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If the user is NOT logged in, kick them to the Auth/Login page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If they ARE logged in, render the child routes (e.g., Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;