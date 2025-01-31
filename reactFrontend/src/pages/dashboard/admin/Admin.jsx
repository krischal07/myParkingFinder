import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import Table from "./Table";

const Admin = () => {
  console.log("we in admin now");
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users")
      .then((res) => res.json())
      .then((data) => setPlaces(data));
  }, []);
  console.log(places);
  return (
    <div>
      <Layout>
        <h1 className="text-3xl">Dashboard</h1>
        <Table places={places} />
      </Layout>
    </div>
  );
};

export default Admin;
