import React from "react";
import Home from "./pages/home/Home";
import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// HEllo this is editeing 
// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// };

import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from "./routes/Routes";

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
