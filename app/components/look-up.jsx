"use client";

import React, { PureComponent } from "react";

import { useState, useEffect } from "react";
import StockPage from "@app/explore/[stock]/page";

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
  LinearGradient,
} from "recharts";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UserAuth } from "@app/context/AuthContext";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  query,
} from "firebase/firestore";
import { db } from "@app/firebase-config";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

/*
    LookUp component for explore page
*/
// for search querying for later
// https://query1.finance.yahoo.com/v1/finance/search?q=AA&lang=en-US&region=US&quotesCount=6&newsCount=3&listsCount=2&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&newsQueryId=news_cie_vespa&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true&enableResearchReports=true&enableCulturalAssets=true&enableLogoUrl=true&uiConfig=[object%20Object]&searchConfig=[object%20Object]&recommendCount=5

export const LookUp = () => {
  // user setup
  const { user } = UserAuth();

  const [successMessage, setSuccessMessage] = useState("");
  const [stock, setStock] = useState("");

  const userCollectionRef = collection(db, "users");
  const [userInfo, setUserInfo] = useState([]);

  const [formInput, setFormInput] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // console.log(filteredData);
        setUserInfo(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

  // console.log(userInfo);

  // Function to add a stock to the user's portfolio
  const addToPortfolio = async () => {
    try {
      console.log(user);
      // Retrieve the user's document reference
      const userDocRef = doc(db, "users", user.uid);

      // Update the user's document to add the stock to the 'portfolio' array
      await updateDoc(userDocRef, {
        portfolio: arrayUnion(symbol), // Use arrayUnion to add the symbol to the array if it doesn't exist
      });
      setSuccessMessage("Stock added to portfolio!");

      // Automatically clear the success message after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      console.log("Stock added to portfolio successfully");
    } catch (error) {
      console.error("Error adding stock to portfolio", error);
    }
  };

  const [range, setRange] = useState("1d");

  const [price, setPrice] = useState(null);

  const [diff, setDiff] = useState(null);

  const [open, setOpen] = useState(null);
  const [postMarketChange, setPostMarketChange] = useState(null);
  const [postMarketChangePercent, setPostMarketChangePercent] = useState(null);
  const [postMarketPrice, setPostMarketPrice] = useState(null);
  const [previousClose, setPreviousClose] = useState(null);
  const [ask, setAsk] = useState(null);
  const [avgVolume, setAvgVolume] = useState(null);
  const [bid, setBid] = useState(null);
  const [daysRange, setDaysRange] = useState(null);
  const [fiftyTwoWkRange, setFiftyTwoWkRange] = useState(null);
  const [volume, setVolume] = useState(null);

  const [change, setChange] = useState(null);
  const [changePercentage, setChangePercentage] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [exchange, setExchange] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [regularMarketTime, setRegularMarketTime] = useState(null);
  const [data, setData] = useState(null);

  const [priceChanged, setPriceChanged] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Function to handle form submission

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFormSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setFormInput(true);
    const params = new URLSearchParams(searchParams);
    console.log("handleForm" + stock);
    if (stock) {
      params.set("query", stock);
    } else {
      params.delete("query");
    }
    console.log("url here?");
    replace(`${pathname}?${params.toString()}`);

    setLoading(true);

    // Reset state variables to null before making a new API call
    setPrice(null);
    setChange(null);
    setSymbol(null);
    setChangePercentage(null);
    setExchange(null);
    setAsk(null);
    setAvgVolume(null);
    setBid(null);
    setDaysRange(null);
    setFiftyTwoWkRange(null);
    setOpen(null);
    setPostMarketChange(null);
    setPostMarketChangePercent(null);
    setPostMarketPrice(null);
    setPreviousClose(null);
    setVolume(null);
    setDisplayName(null);
    setData(null);

    // API URLs
    const quoteUrl = `http://127.0.0.1:5000/api/quote_data?symbol=${stock}`;
    const chartUrl = `http://127.0.0.1:5000/api/chart_data?symbol=${stock}&interval=2m&range=1d`;
    const hiddenQuoteUrl = `http://127.0.0.1:5000/api/hidden_quote_data?symbol=${stock}`;

    try {
      // Fetch data from the API
      const responseQuote = await fetch(quoteUrl);
      const responseChart = await fetch(chartUrl);
      const responseHiddenQuote = await fetch(hiddenQuoteUrl);

      const resultQuote = await responseQuote.json();
      const resultChart = await responseChart.json();
      const resultHiddenQuote = await responseHiddenQuote.json();

      console.log(resultHiddenQuote);

      // setLoading(false); // Set loading to false after fetching data

      const formattedChartData = resultChart.chart.result[0].timestamp.map(
        (timestamp, index) => ({
          x: new Date(timestamp * 1000), // Assuming timestamp is in seconds
          y: resultChart.chart.result[0].indicators.quote[0].close[index],
        })
      );

      setDiff(
        resultChart.chart.result[0].meta.regularMarketPrice -
          resultChart.chart.result[0].meta.chartPreviousClose
      );

      setData(formattedChartData);

      // console.log(resultQuote);
      // Extract data from the API response
      // const price = resultQuote.quote_data[0].regular_market_price;
      const price =
        resultHiddenQuote.quoteResponse.result[0].regularMarketPrice.toFixed(2);
      const change =
        resultHiddenQuote.quoteResponse.result[0].regularMarketChange.toFixed(
          2
        );
      const symbol = resultChart.chart.result[0].meta.symbol;
      const changePercentage =
        resultHiddenQuote.quoteResponse.result[0].regularMarketChangePercent.toFixed(
          2
        );
      const exchange =
        resultHiddenQuote.quoteResponse.result[0].fullExchangeName;
      const ask = resultQuote.quote_data[0].ask;
      const avgVolume = resultQuote.quote_data[0].avg_volume;
      const bid = resultQuote.quote_data[0].bid;
      const daysRange = resultQuote.quote_data[0].days_range;
      const fiftyTwoWkRange = resultQuote.quote_data[0].fifty_two_wk_range;
      const open = resultQuote.quote_data[0].open;
      const postMarketChange = resultQuote.quote_data[0].post_market_change;
      const postMarketChangePercent =
        resultQuote.quote_data[0].post_market_change_percent;
      const postMarketPrice = resultQuote.quote_data[0].post_market_price;
      const previousClose = resultQuote.quote_data[0].previous_close;
      const volume = resultQuote.quote_data[0].volume;
      const displayName = resultQuote.quote_data[0].display_name;
      // Set state variables with the extracted data
      setChange(change);
      setSymbol(symbol);
      setChangePercentage(changePercentage);
      setPrice(price); // Don't forget to set the price
      setExchange(exchange);
      setAsk(ask);
      setAvgVolume(avgVolume);
      setBid(bid);
      setDaysRange(daysRange);
      setFiftyTwoWkRange(fiftyTwoWkRange);
      setOpen(open);
      setPostMarketChange(postMarketChange);
      setPostMarketChangePercent(postMarketChangePercent);
      setPostMarketPrice(postMarketPrice);
      setPreviousClose(previousClose);
      setVolume(volume);
      setDisplayName(displayName);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (stock) => {
    setLoading(true);
    try {
      const responseQuote = await fetch(
        `http://127.0.0.1:5000/api/quote_data?symbol=${stock}`
      );
      const responseChart = await fetch(
        `http://127.0.0.1:5000/api/chart_data?symbol=${stock}&interval=2m&range=1d`
      );

      const resultQuote = await responseQuote.json();
      const resultChart = await responseChart.json();

      // formatting for chart
      const formattedChartData = resultChart.chart.result[0].timestamp.map(
        (timestamp, index) => ({
          x: new Date(timestamp * 1000),
          y: resultChart.chart.result[0].indicators.quote[0].close[index],
        })
      );

      setDiff(
        resultChart.chart.result[0].meta.regularMarketPrice -
          resultChart.chart.result[0].meta.chartPreviousClose
      );

      setData(formattedChartData);

      const price = resultQuote.quote_data[0].regular_market_price;
      const change = resultQuote.quote_data[0].regular_market_change;
      const symbol = resultChart.chart.result[0].meta.symbol;
      const changePercentage =
        resultQuote.quote_data[0].regular_market_change_percent;
      const exchange = resultQuote.quote_data[0].exchange;
      const ask = resultQuote.quote_data[0].ask;
      const avgVolume = resultQuote.quote_data[0].avg_volume;
      const bid = resultQuote.quote_data[0].bid;
      const daysRange = resultQuote.quote_data[0].days_range;
      const fiftyTwoWkRange = resultQuote.quote_data[0].fifty_two_wk_range;
      const open = resultQuote.quote_data[0].open;
      const postMarketChange = resultQuote.quote_data[0].post_market_change;
      const postMarketChangePercent =
        resultQuote.quote_data[0].post_market_change_percent;
      const postMarketPrice = resultQuote.quote_data[0].post_market_price;
      const previousClose = resultQuote.quote_data[0].previous_close;
      const volume = resultQuote.quote_data[0].volume;
      const displayName = resultQuote.quote_data[0].display_name;

      setChange(change);
      setSymbol(symbol);
      setChangePercentage(changePercentage);
      setPrice(price);
      setExchange(exchange);
      setAsk(ask);
      setAvgVolume(avgVolume);
      setBid(bid);
      setDaysRange(daysRange);
      setFiftyTwoWkRange(fiftyTwoWkRange);
      setOpen(open);
      setPostMarketChange(postMarketChange);
      setPostMarketChangePercent(postMarketChangePercent);
      setPostMarketPrice(postMarketPrice);
      setPreviousClose(previousClose);
      setVolume(volume);
      setDisplayName(displayName);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setPriceChanged(true);
    }
  };

  const querySymbol = searchParams.get("query")?.toString();

  useEffect(() => {
    console.log(querySymbol);

    if (querySymbol && !formInput) {
      // If there's a symbol in the query parameters, set it to the formStock state
      setStock(querySymbol);
      fetchData(querySymbol);
    }
  }, [querySymbol]);

  // Function to handle interval change
  const handleIntervalChange = async (newRange) => {
    setRange(newRange);
    // Update the chart data based on the selected interval

    let interval = "";
    if (newRange === "1d") {
      interval = "2m";
    } else if (newRange === "5d") {
      interval = "15m";
    } else if (newRange === "1mo") {
      interval = "30m";
    } else if (newRange == "6mo") {
      interval = "1d";
    } else if (newRange == "ytd") {
      interval = "30m";
    } else if (newRange === "1y") {
      interval = "1d";
    } else if (newRange === "5y") {
      interval = "1wk";
    } else if (newRange === "max") {
      interval = "1mo";
    }

    const responseChart = await fetch(
      `http://127.0.0.1:5000/api/chart_data?symbol=${stock}&interval=${interval}&range=${newRange}`
    );

    const resultChart = await responseChart.json();

    // formatting for chart
    const formattedChartData = resultChart.chart.result[0].timestamp.map(
      (timestamp, index) => ({
        x: new Date(timestamp * 1000),
        y: resultChart.chart.result[0].indicators.quote[0].close[index],
      })
    );

    setDiff(
      resultChart.chart.result[0].meta.regularMarketPrice -
        resultChart.chart.result[0].meta.chartPreviousClose
    );

    setData(formattedChartData);
  };

  // Use useEffect to trigger the fetch every 15 seconds
  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      if (stock != "") {
        setPriceChanged(false);
        fetchData();
      }
    }, 600000);

    // Cleanup interval when the component unmounts
    return () => clearInterval(fetchDataInterval);
  }, [stock]); // Add stock as a dependency so it fetches data when the stock changes

  return (
    <>
      {/* JSX for rendering the UI */}
      <div className="flex flex-col md:flex-row justify-center w-full">
        {/* Form for searching stock */}
        <div className="">
          <div className=" mx-4 p-4 mt-5 max-w-md md:w-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900">Explore</h1>
            <form className="space-y-2" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="ticker"
                placeholder="Search ticker..."
                // value={formStock}
                onChange={(e) => {
                  setStock(e.target.value);
                }}
                className="w-full border-2 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                defaultValue={searchParams.get("query")?.toString()}
              />

              <input
                type="submit"
                value="Search"
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
              />
              <br />
            </form>
            {/* Display stock information */}
            <div className=" mt-6">
              {loading ? (
                <Skeleton count={3} height={30} />
              ) : (
                <>
                  {displayName != null ? (
                    <p className="text-5xl text-gray-900">{displayName}</p>
                  ) : (
                    ""
                  )}

                  {symbol != null ? (
                    <p className="text-2xl text-gray-900">
                      {exchange}: {symbol}
                    </p>
                  ) : (
                    ""
                  )}

                  {price != null ? (
                    <p
                      className={`pb-1 text-6xl ${priceChanged ? "flash" : ""}`}
                    >
                      ${price}{" "}
                    </p>
                  ) : (
                    ""
                  )}

                  {change != null ? (
                    <div
                      className={
                        change > 0
                          ? ` text-2xl bg-green-500 rounded-lg p-2 inline-block`
                          : ` text-2xl bg-red-500 rounded-lg p-2 inline-block`
                      }
                    >
                      {change && changePercentage > 0 ? (
                        <p className={`${priceChanged && "flash"}`}>
                          +{change} (+{changePercentage}%) {[postMarketPrice]}
                        </p>
                      ) : (
                        <p className={`${priceChanged && "flash"}`}>
                          {change} ({changePercentage})
                        </p>
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {symbol != null && user && (
                    <div className="mt-1">
                      <button
                        onClick={addToPortfolio}
                        className="mt-4 bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:shadow-outline-green"
                      >
                        Add to portfolio
                      </button>
                      {successMessage && (
                        <p className="text-green-500">{successMessage}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}

        <div className="md:w-1/2 p-3 mx-auto mb-4 mt-3">
          <div className="flex flex-col pb-0">
            <div className=" p-3 mb-2">
              {loading ? (
                <div className="">
                  <Skeleton height={400} width={600} />
                </div>
              ) : (
                <div
                  className={`${
                    data !== null && "bg-white rounded-xl shadow-md"
                  }`}
                >
                  {data !== null && (
                    <div className=" justify-between mt-3 p-2 mb-2">
                      <button
                        onClick={() => handleIntervalChange("1d")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        1D
                      </button>
                      <button
                        onClick={() => handleIntervalChange("5d")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500  text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        5D
                      </button>
                      <button
                        onClick={() => handleIntervalChange("1mo")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        1M
                      </button>
                      <button
                        onClick={() => handleIntervalChange("6mo")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        6M
                      </button>
                      <button
                        onClick={() => handleIntervalChange("ytd")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        YTD
                      </button>
                      <button
                        onClick={() => handleIntervalChange("1y")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        1Y
                      </button>
                      <button
                        onClick={() => handleIntervalChange("5y")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        5Y
                      </button>
                      <button
                        onClick={() => handleIntervalChange("max")}
                        style={{ marginRight: "8px", marginBottom: "8px" }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        Max
                      </button>
                      {/* Add more buttons for other intervals as needed */}
                    </div>
                  )}

                  <ResponsiveContainer width="100%" height={400} className="">
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
                      <defs>
                        <linearGradient
                          id="fadeGreen"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00FF00"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#00FF00"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fadeRed"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ff3300"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ff3300"
                            stopOpacity={0}
                          />
                        </linearGradient>

                        {/* <linearGradient id="varkUe-1078" x1="0%" x2="0%" y1="0%" y2="100%"><stop offset="0%" stop-color="#34A853" stop-opacity="0.38"></stop><stop offset="90%" stop-color="#DBF0E5" stop-opacity="0"></stop></linearGradient> */}
                      </defs>
                      <XAxis dataKey="x" />
                      <YAxis domain={["auto", "auto"]} />
                      {data !== null && <Tooltip />}
                      <Area
                        type="monotone"
                        dataKey="y"
                        stroke={diff > 0 ? "#00FF00" : "#ff3300"}
                        fill={diff > 0 ? "url(#fadeGreen)" : "url(#fadeRed)"}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Additional information */}

          <div className="">
            {(symbol || loading) && (
              <div className=" rounded-2xl p-3 mx-3 border-1 border-gray-300 bg-white shadow-md text-xl">
                {previousClose != null ? (
                  <p className="border-b border-gray-300 pb-2">
                    Previous Close: {previousClose}
                  </p>
                ) : (
                  loading && <Skeleton width={300} />
                )}

                {open != null ? (
                  <p className="border-b border-gray-300 pb-2">Open: {open}</p>
                ) : (
                  loading && <Skeleton />
                )}

                {bid != null ? (
                  <p className="border-b border-gray-300 pb-2">Bid: {bid}</p>
                ) : (
                  loading && <Skeleton />
                )}
                {ask != null ? (
                  <p className="border-b border-gray-300 pb-2">Ask: {ask}</p>
                ) : (
                  loading && <Skeleton />
                )}
                {daysRange != null ? (
                  <p className="border-b border-gray-300 pb-2">
                    Day's Range: {daysRange}
                  </p>
                ) : (
                  loading && <Skeleton />
                )}

                {fiftyTwoWkRange != null ? (
                  <p className="border-b border-gray-300 pb-2">
                    52 Week Range: {fiftyTwoWkRange}
                  </p>
                ) : (
                  loading && <Skeleton />
                )}

                {volume != null ? (
                  <p className="border-b border-gray-300 pb-2">
                    Volume: {volume}
                  </p>
                ) : (
                  loading && <Skeleton />
                )}

                {avgVolume != null ? (
                  <p className="border-b border-gray-300 pb-2">
                    Avg. Volume: {avgVolume}
                  </p>
                ) : (
                  loading && <Skeleton />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
