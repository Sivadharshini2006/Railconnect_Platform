import React from 'react';
import Navbar from "../components/Navbar";
import SearchCard from "../components/SearchCard";
import Features from "../components/Features";

export default function Home() {
  return (
    <>
      <Navbar />
      <SearchCard />
      <Features />
    </>
  );
}
