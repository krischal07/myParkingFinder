import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: (
      <SignedIn>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </SignedIn>
    ),
  },
  { path: "*", element: <div>Not found</div> },
];
export default routes;
