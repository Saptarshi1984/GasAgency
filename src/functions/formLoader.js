/* This is the forms loader */

/* This will load Sign Up form. */
document.getElementById("btnSignup").addEventListener('click', () => {

    document.getElementById("signUpForm").style.display = "flex";
    document.getElementById("signInForm").style.display = "none";
    
})

/* This will load Sign In form. */
document.getElementById("btnSignin").addEventListener('click', () => {
    
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("signInForm").style.display = "flex";

})

/* This will load Admin login form. */
document.getElementById("btnAdminLogin").addEventListener('click', () => {

    document.getElementById("signInForm").style.display = "none";
    document.getElementById("adminLogin").style.display = "flex";
})

/* This will load Sign In form. */
document.getElementById("userLogin").addEventListener('click', () => {

    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("signInForm").style.display = "flex";
})