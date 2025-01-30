import React from "react";
import Layout from "../../components/layout/Layout";
import { useUser } from "@clerk/clerk-react";
import SignedInHome from "../signedInHome/SignedInHome";
import LandingPage from "../landingPage/LandingPage";
const Home = () => {
  const { user, isSignedIn } = useUser();
  console.log("user", user);
  console.log("singnedIn", isSignedIn);
  return <Layout>{isSignedIn ? <SignedInHome /> : <LandingPage />}</Layout>;
};

export default Home;
