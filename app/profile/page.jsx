"use client";

import React from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "app/firebase-config.js";
import { db } from "@app/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import { Loader } from "@app/components/loader";

export default function Profile() {
  const [user, setUser] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
        setUserInfo(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <div className="flex items-center justify-center">
      {loading ? (
        <>
          <Loader />
        </>
      ) : !user ? (
        <></>
      ) : (
        <div className="prof-page">
          {userInfo.map((userInfo) => (
            <div key={userInfo.email}>
              {user?.email == userInfo.email ? userInfo.username : ""}
            </div>
          ))}
          <br />
          <p className="p-2">{user?.email}</p>
          <br></br>
          <p className="p-2">View your stocks</p>
          <br></br>
          <p className="p-2">Set profile picture</p>
        </div>
      )}
    </div>
  );
}
