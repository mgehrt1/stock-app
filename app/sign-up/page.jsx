import 'app/globals.css';

export default function SignUp() {
    return (

        <div className='sign-up-page'>
            <h1 className='sign-up-text'>Create a new account</h1>
            <input className='input' type="text" placeholder='First name'></input>
            <input className='input' type="text" placeholder='Last name'></input>
            <input className='input' type="text" placeholder='Email'></input>
            <br></br>

            <input className='input' type='password' placeholder='Password'></input>
            <br></br>
            <h1 className=''>Forgot password?</h1>
            <br></br>
            <button className='sign-up-btn'><a href="C:/stock-app-1/app/home.jsx">Sign up</a></button>
        </div>
    );
}