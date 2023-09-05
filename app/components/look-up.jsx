"use client";

import React, { PureComponent } from "react";

import { useState, useEffect } from "react";
import Ticker from "@app/stock/[ticker]/page";
import { Loader } from "@app/components/loader";
import { HiArrowUp } from "react-icons/hi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

let data = [];

/*
    lookUp component for explore page
*/
export const LookUp = () => {
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState(null);
  const [targetHighPrice, setTargetHighPrice] = useState(-1);
  const [targetLowPrice, setTargetLowPrice] = useState(-1);
  const [targetMeanPrice, setTargetMeanPrice] = useState(-1);
  const [targetMedianPrice, setTargetMedianPrice] = useState(-1);
  const [recommendationMean, setRecommendationMean] = useState(-1);
  const [recommendationKey, setRecommendationKey] = useState(null);
  const [currentRatio, setCurrentRatio] = useState(null);

  const [change, setChange] = useState(0);
  const [changePercentage, setChangePercentage] = useState(0);
  const [symbol, setSymbol] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [regularMarketTime, setRegularMarketTime] = useState(null);
  // const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // API SETUP
    const url = `https://mboum-finance.p.rapidapi.com/mo/module/?symbol=${stock}&module=financial-data`;
    const quoteUrl = `https://mboum-finance.p.rapidapi.com/qu/quote/?symbol=${stock}`;

    const options = {
      method: "GET",

      headers: {
        "X-RapidAPI-Key": "2ff77addadmshafbc86675fd47cdp10f6afjsnb2d959a3dbae",
        "X-RapidAPI-Host": "mboum-finance.p.rapidapi.com",
      },
    };

    const historyUrl = `https://yahoo-finance127.p.rapidapi.com/historic/${stock}/5m/1d`;

    const optionsYH = {
      method: "GET",

      headers: {
        "X-RapidAPI-Key": "2ff77addadmshafbc86675fd47cdp10f6afjsnb2d959a3dbae",
        "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
      },
    };

    try {
      const responseFinancial = await fetch(url, options);
      const responseQuote = await fetch(quoteUrl, options);
      const responseChart = await fetch(historyUrl, optionsYH);

      setLoading(false);
      const resultFinancial = await responseFinancial.json();
      const resultQuote = await responseQuote.json();
      const resultChart = await responseChart.json();

      const quote = resultChart.indicators.quote[0];

      data = resultChart.timestamp.map((timestamp, index) => ({
        x: new Date(timestamp * 1000).toLocaleTimeString(),

        y: quote.open[index],
      }));

      console.log(data);
      console.log(resultFinancial);
      console.log(resultQuote);

      // financialData stats

      const price = resultFinancial.financialData?.currentPrice.raw;
      const targetHighPrice =
        resultFinancial.financialData?.targetHighPrice.raw;
      const targetLowPrice = resultFinancial.financialData?.targetLowPrice.raw;
      const targetMeanPrice =
        resultFinancial.financialData?.targetMeanPrice.raw;
      const targetMedianPrice =
        resultFinancial.financialData?.targetMedianPrice.raw;
      const recommendationMean =
        resultFinancial.financialData?.recommendationMean.raw;
      const recommendationKey =
        resultFinancial.financialData?.recommendationKey;

      setPrice(price);
      setTargetHighPrice(targetHighPrice);
      setTargetLowPrice(targetLowPrice);
      setTargetMeanPrice(targetMeanPrice);
      setTargetMedianPrice(targetMedianPrice);
      setRecommendationMean(recommendationMean);
      setRecommendationKey(recommendationKey);
      setCurrentRatio(currentRatio);

      // quote stats
      const change = resultQuote[0].regularMarketChange;
      const symbol = resultQuote[0].symbol;
      const exchange = resultQuote[0].exchange;
      const displayName = resultQuote[0].displayName;
      const changePercentage = resultQuote[0].regularMarketChangePercent;
      const regularMarketTime = resultQuote[0].regularMarketTime;

      setChange(change);
      setSymbol(symbol);
      setExchange(exchange);
      setDisplayName(displayName);
      setChangePercentage(changePercentage);
      setRegularMarketTime(new Date(regularMarketTime * 1000));
      console.log(regularMarketTime);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className=" flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-left">
            <div className="container font-thin">
              <h1 className=" text-5xl  leading-7 text-gray-900">Explore</h1>
              <br></br>
              <form
                onSubmit={handleFormSubmit}
                className=" flex-col items-center"
              >
                <input
                  type="text"
                  name="ticker"
                  placeholder="Search ticker..."
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="search-ticker-input border-2 border-black"
                />
                <br />
                <input
                  type="submit"
                  value="Search"
                  className="explore-btn p-2"
                />
                <br />
              </form>

              {symbol != null && exchange != null && displayName != null && (
                <>
                  <p className=" text-5xl text-left  text-gray-900">
                    {displayName}
                  </p>

                  <p className="text-2xl text-left  text-gray-900">
                    {exchange}: {symbol}
                  </p>

                  {price >= 0 && <p className=" pb-1 text-6xl">${price} </p>}
                  <p className="text-2xl">
                    {regularMarketTime &&
                      regularMarketTime.toLocaleTimeString()}
                  </p>
                  {change != null && (
                    <div
                      className={
                        change > 0
                          ? " mr-24 p-1 text-justify text-2xl rounded-lg bg-green-500"
                          : " mr-24 p-1 text-justify text-2xl bg-red-500 rounded-lg"
                      }
                    >
                      {change && changePercentage > 0 ? (
                        <p>
                          +{change} (+{changePercentage}%)
                        </p>
                      ) : (
                        <p>
                          {change} ({changePercentage}%)
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <br />
            </div>
            <div
              className={
                price != null
                  ? " flex justify-end rounded-2xl p-3 border-1 border-neutral-900 text-xl"
                  : ""
              }
            >
              {targetHighPrice >= 0 ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Target High Price: ${targetHighPrice}
                </p>
              ) : (
                ""
              )}

              {targetLowPrice >= 0 ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Target Low Price: ${targetLowPrice}
                </p>
              ) : (
                ""
              )}

              {targetMeanPrice >= 0 ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Target Mean Price: ${targetMeanPrice}
                </p>
              ) : (
                ""
              )}

              {targetMedianPrice >= 0 ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Target Median Price: ${targetMedianPrice}
                </p>
              ) : (
                ""
              )}

              {recommendationMean >= 0 ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Recommendation Mean: ${recommendationMean}
                </p>
              ) : (
                ""
              )}

              {recommendationKey != null ? (
                <p>
                  Recommendation Key:{" "}
                  <span
                    className={
                      recommendationKey == "hold"
                        ? "recommend-key-hold font-semibold text-xl"
                        : "recommend-key-buy font-semibold text-xl"
                    }
                  >
                    {recommendationKey}
                  </span>
                </p>
              ) : (
                ""
              )}

              {currentRatio != null ? (
                <p className="border-1 border-transparent border-b-slate-900">
                  Current Ratio: %{currentRatio}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              width={500}
              height={200}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="x" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="y"
                stroke={change > 0 ? "#00ff00" : "#ff3300"}
                fill={change > 0 ? "#00ff00" : "#ff3300"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
};
