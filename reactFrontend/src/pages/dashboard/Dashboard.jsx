import React from "react";
import Layout from "../../components/layout/Layout";
import { useUser, useAuth } from "@clerk/clerk-react";
const Dashboard = () => {
  return (
    <Layout>
      <div>Dashboard</div>
    </Layout>
  );
};

export default Dashboard;
