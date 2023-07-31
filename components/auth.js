"use client";
import "app/globals.css";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "app/firebase-config.js";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      ></input>
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      ></input>
      <br></br>
      <button onClick={signIn} className="sign-up-btn">
        <Link href={"/"}>Sign up</Link>
      </button>
      <br></br>
      <button onClick={signInWithGoogle} className="sign-up-btn">
        <Link href="">Sign Up With Google</Link>
      </button>
      <br></br>
      <button onClick={logout} className="sign-up-btn">
        <Link href="">Logout</Link>
      </button>
    </div>
  );
};
