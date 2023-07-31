import "app/globals.css";
import { Auth } from "components/auth.js";

export default function SignUp() {
  return (
    <div className="bubbles">
      <div className="sign-up-page">
        <h1 className="sign-up-text">Create a new account</h1>
        <input className="input" type="text" placeholder="First name"></input>
        <input className="input" type="text" placeholder="Last name"></input>

        <Auth />

        <h1 className="">Forgot password?</h1>
      </div>
    </div>
  );
}
