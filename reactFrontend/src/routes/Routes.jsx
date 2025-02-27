import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "../pages/home/Home";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import AdminProtectedRoute from "../components/adminProtectedRoute/AdminProtectedRoute";
import Admin from "../pages/dashboard/admin/Admin";
import Addspot from "../pages/dashboard/admin/addSpot/Addspot";

const routes = [
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <Admin />
      </AdminProtectedRoute>
    ),
  },

  {
    path: "/addspot",
    element: (
      <AdminProtectedRoute>
        <Addspot />
      </AdminProtectedRoute>
    ),
    // element: <Addspot />,
  },
  { path: "*", element: <div>Not found</div> },
];
export default routes;
