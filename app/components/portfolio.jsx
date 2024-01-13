"use client";

import React, { useEffect, useState } from "react";
import { db } from "@app/firebase-config";
import { collection, doc, getDoc } from "firebase/firestore";
import { UserAuth } from "@app/context/AuthContext";
import { StockCard } from "./stock-card";
import { useRouter } from "next/navigation";

export const Portfolio = ({ userId }) => {
  const router = useRouter();

  const userCollectionRef = collection(db, "users");
  const [userInfo, setUserInfo] = useState(null);
  const { user } = UserAuth();
  console.log(user);

  useEffect(() => {
    const getUserDoc = async () => {
      try {
        if (user) {
          console.log(user);
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserInfo({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
          } else {
            console.log("User document does not exist");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    getUserDoc();
  }, [user]);

  // if (user === null) {
  //   return (

  //   );
  // } else if (!userInfo) {
  //   return <div className="text-center mt-8 text-gray-600">Loading...</div>;
  // }

  if (!userInfo) {
    return <div className="text-center mt-8 text-gray-600">Loading...</div>;
  }
  const { portfolio } = userInfo;

  const handleCardClick = (stock) => {
    router.push(`/explore?query=${stock}`);
  };

  return (
    <>
      {user === null ? (
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Portfolio!
          </h1>
          <p className="text-gray-600">
            Sign in to keep track of your favorite stocks and manage your
            portfolio.
          </p>
          <a href="/sign-in">
            <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-500">
              Sign In
            </button>
          </a>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            {userInfo.username}'s Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {portfolio &&
              portfolio.map((stock) => (
                <StockCard
                  key={stock}
                  stock={stock}
                  onClick={handleCardClick}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
