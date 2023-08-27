"use client";
import { LogIn } from "@app/components/sign-in-page";
import "app/globals.css";
import "app/bootstrap.min.css";

import { useState } from "react";

export default function SignIn() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();
  };
  return <LogIn></LogIn>;
}
