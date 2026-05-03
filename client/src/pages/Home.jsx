import React from "react";
import Hero from "../components/Hero/Hero.jsx";
import Category from "./Category";

const Home = () => {
  return (
    <div className="space-y-4  ">
      <Hero />
      <Category />
    </div>
  );
};

export default Home;
