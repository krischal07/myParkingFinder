import React from "react";
import MapComponent from "./map/Map";
import AdminMap from "./map/AdminMap";

const SignedInHome = () => {
  return (
    <div>
      <h1>SignedIn Home</h1>
      {/* <AdminMap /> */}
      <MapComponent />
    </div>
  );
};

export default SignedInHome;
