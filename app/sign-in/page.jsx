'use client'

import { useState } from "react";

export default function SignIn() {
  const handleUserSubmit = async (e) => {
    e.preventDefault();


  }
  return (
    <div>
      <h1>Sign in page</h1>
        <form onSubmit={handleUserSubmit}>
          <input type="text" name="username" placeholder="Enter Username" value="" onChange={(e) => setStock(e.target.value) } className ="border-2 border-black" />
        </form>
    </div>

  ) 
}