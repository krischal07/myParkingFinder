import Home from "../pages/home/Home";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  { path: "*", element: <div>Not found</div> },
];
export default routes;
