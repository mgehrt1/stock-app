"use client";

import React from "react";
import { useState } from "react";

export default function Explore() {
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState(-1);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const key = process.env.NEXT_PUBLIC_STOCK_API_KEY;
    const host = process.env.NEXT_PUBLIC_STOCK_API_HOST;
    const url = `https://mboum-finance.p.rapidapi.com/mo/module/?symbol=${stock}&module=financial-data`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const price = result.financialData.currentPrice.raw;
      setPrice(price);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-center">
      <h1>Explore Page</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="ticker"
          placeholder="Search ticker"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border-2 border-black"
        />
        <input
          type="submit"
          value="Search"
          className="border-2 border-black bg-gray-200 ml-2 px-2"
        />
      </form>
      {price >= 0 && <p>${price} </p>}
    </div>
  );
}
