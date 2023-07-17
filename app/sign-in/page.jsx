'use client'
import 'app/globals.css';

import { useState } from "react";

export default function SignIn() {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    

  }
  return (
    <div className='SignInbackground'>
    <h1 className='h1'>Username:</h1>
      <form>
        <input type="text" name="username" placeholder="Enter Username" value={username} onChange={(e) => setUser(e.target.value) } className ="border-2 border-black" />
        <br></br>
        <br></br>
        <h1>Password:</h1>
        <input type="password" name="password" placeholder=" Enter password" value={username} onChange={(e) => setUser(e.target.value) } className ="border-2 border-black"/>
        <input type="submit" value="Search" className="border-2 border-black bg-gray-200 ml-2 px-2" />
        <br></br>
        <a className="forgotPasswordLink" href="./forgotpassword">Forgot password?</a>
      </form>
  </div>

  ) 
}