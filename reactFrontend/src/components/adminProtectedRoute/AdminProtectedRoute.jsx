import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const admin = import.meta.env.VITE_ADMIN_ROLE;
  console.log("admin", admin);
  return user?.firstName === admin ? children : <Navigate to="/signin" />;
};

export default AdminProtectedRoute;
