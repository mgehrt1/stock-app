"use client";
import "app/globals.css";
import "app/bootstrap.min.css";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserInfo,
  getAdditionalUserInfo,
  getAuth,
} from "firebase/auth";
import { createUserDocument } from "@app/firebase-config";
import { use, useEffect, useState } from "react";
import { auth, googleProvider } from "app/firebase-config.js";
import { db } from "@app/firebase-config";
import { getDocs, collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

/*
  TODO: create user database so that user's name may be displayed throughout navbar and site

        IMPLEMENT PROTECTED/PRIVATE ROUTES FOR USERS
*/

export const Auth = () => {
  const router = useRouter();
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const auth = getAuth();

  const [user, setUser] = useState([]);

  // new user states
  const [username, setUsername] = useState("");

  const userCollectionRef = collection(db, "users");

  const getUser = async () => {
    try {
      const data = await getDocs(userCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setUser(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [error, setError] = useState("");

  const signUp = async () => {
    try {
      const authUser = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );

      // Check if the authentication is successful and the user object exists
      if (authUser && authUser.user) {
        const userId = authUser.user.uid;

        // Specify the user ID as the document ID
        const userDocRef = doc(userCollectionRef, userId);

        // Set the user document data
        await setDoc(userDocRef, {
          email: signUpEmail,
          username: username,
          portfolio: [],
        });

        console.log("User document added to Firestore successfully");

        // Redirect or perform other actions after successful sign-up
        router.push("/");
      } else {
        console.error("Authentication failed or user object not found");
      }
    } catch (err) {
      // Handle authentication or Firestore errors
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email address already in use");
      } else if (err.code === "auth/weak-password") {
        setError("Weak password: password should be at least 6 characters");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email");
      } else if (err.code === "auth/missing-password") {
        setError("Please enter a password");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((data) => {
        console.log(data, "authData");

        router.push("/");
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Sign Up</h1>
        <input
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          id="username"
        />
        <input
          value={signUpEmail}
          placeholder="Email"
          onChange={(e) => setSignUpEmail(e.target.value)}
          className="input mt-4"
        />
        <input
          value={signUpPassword}
          placeholder="Password"
          type="password"
          onChange={(e) => setSignUpPassword(e.target.value)}
          className="input mt-4"
          id="password"
        />
        <p className="text-red-500 mt-2">{error}</p>
        <button
          onClick={signUp}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:shadow-lg focus:outline-none focus:ring focus:border-blue-500 mt-4"
        >
          <Link href={""} className="sign-up-btn-text">
            Sign up
          </Link>
        </button>
        <div className="flex flex-col items-center mt-4">
          <button className="btn-google p-3" onClick={signInWithGoogle}>
            {/* ... (Your Google SVG content) */}
          </button>
          <button className="font-semibold leading-7 text-gray-900 mt-4">
            <Link href={"/sign-in"} className="text-blue-500">
              Sign In
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
