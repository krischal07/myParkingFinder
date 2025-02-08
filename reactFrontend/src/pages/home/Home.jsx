import React from "react";
import Layout from "../../components/layout/Layout";
import { useUser } from "@clerk/clerk-react";
import SignedInHome from "../signedInHome/SignedInHome";
import LandingPage from "../landingPage/LandingPage";
const Home = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  console.log("user", user);
  console.log("singnedIn", isSignedIn);
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>  
      </Layout>
    );
  }
  return <Layout>{isSignedIn ? <SignedInHome /> : <LandingPage />}</Layout>;
};

export default Home;
