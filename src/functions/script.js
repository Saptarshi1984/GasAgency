const signUp = () => {

    const signup = document.getElementById("authForm");

    signup.innerHTML = "";

    signup.innerHTML = ` <h2>Create an Account</h2>
        <input type="text" placeholder="Enter your email..." required>
        <input type="password" placeholder="password" required>
        <button type="submit">Login</button>
        <hr>
        <h4>Or Register with</h4>
        <button type="submit"><i class="fa-brands fa-google"></i>Login with Google</button>
        <button type="submit"><i class="fa-brands fa-facebook-f"></i>Login with Facebook</button>
        <button type="submit"><i class="fa-brands fa-x-twitter"></i>Login with X</button>

        <a href="#">Forgot Password?</a>
        <h4>Already Registered? <a href="#" onclick="signIn()">Login</a> </h4>`;
    
}

const signIn = () => {
    
    const signin = document.getElementById("authForm");

        signin.innerHTML = "";

        signin.innerHTML = `<h2>Login to your account</h2>
        <input type="text" placeholder="Enter your email..." required>
        <input type="password" placeholder="password" required>
        <button type="submit">Login</button>
        <hr>
        <h4>Other Login options</h4>
        <button type="submit"><i class="fa-brands fa-google"></i>Login with Google</button>
        <button type="submit"><i class="fa-brands fa-facebook-f"></i>Login with Facebook</button>
        <button type="submit"><i class="fa-brands fa-x-twitter"></i>Login with X</button>

        <a href="#">Forgot Password?</a>
        <h4>Not Registered? <a href="#" onclick="signUp()">Sign Up</a> </h4>
        <button type="button" onclick= "adminLogin()">Admin Login</button>`;
}

const adminLogin = () => {

    const AdminSignIn = document.getElementById("authForm");

    AdminSignIn.innerHTML = "";

    AdminSignIn.innerHTML = `<h2>Admin Login</h2>
        <input type="text" placeholder="Enter your email..." required>
        <input type="password" placeholder="password" required>
        <button type="submit">Login</button>
        <hr>       

        <a href="#">Forgot Password?</a>
        <button type="button" onclick="signIn()">User Login</button>`;

}