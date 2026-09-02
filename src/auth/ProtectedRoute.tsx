import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem("token"); // or your auth state

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}