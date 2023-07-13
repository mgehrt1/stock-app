'use client'

import { useState } from "react";

export default function Explore() {
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState(-1);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const url = `https://mboum-finance.p.rapidapi.com/mo/module/?symbol=${stock}&module=financial-data`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '2f897fcedbmsh980fcbcfc4cbb38p1bf4b7jsn18e40b49644f',
            'X-RapidAPI-Host': 'mboum-finance.p.rapidapi.com'
          }
        };
        
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const price = result.financialData.currentPrice.raw;
            setPrice(price);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Explore Page</h1>
            <form onSubmit={handleFormSubmit}>
                <input type="text" name="ticker" placeholder="Search ticker" value={stock} onChange={(e) => setStock(e.target.value) } className="border-2 border-black" />
                <input type="submit" value="Search" className="border-2 border-black bg-gray-200 ml-2 px-2" />
            </form>
            {price >= 0 && <p>${price} </p>}
        </div>
    );
}
