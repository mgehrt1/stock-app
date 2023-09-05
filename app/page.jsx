import React from "react";
import "app/globals.css";
import Image from "next/image";

// server side component
export default function Home() {
  return (
    <div className=" text-center font-thin background">
      <h1 className=" text-7xl mt-40  ">Welcome to the Stock App</h1>
      <p className=" text-3xl mt-3">
        Explore stocks, keep a portfolio, and view live stock tickers
      </p>
    </div>
  );
}
