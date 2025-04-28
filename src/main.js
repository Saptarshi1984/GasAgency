import './style.scss';
import { initializeApp } from "firebase/app";
import { getAuth, 
         signInWithEmailAndPassword, 
         createUserWithEmailAndPassword } from "firebase/auth";


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC3UhFNEGeyMNE5zsb4e4Y-TGuJxy8ZEfw",
  authDomain: "gassys-5b3df.firebaseapp.com",
  projectId: "gassys-5b3df",
  storageBucket: "gassys-5b3df.firebasestorage.app",
  messagingSenderId: "658508671421",
  appId: "1:658508671421:web:06a05d2d53257181c64ad4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();


  const emailId = document.getElementById("userEmail");
  const passwordInput = document.getElementById("userPassword");
  const loginBtn = document.getElementById("btnLogin");

    loginBtn.addEventListener('click', () => {
      const email = emailId.value;
      const password = passwordInput.value;  
      
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        /* alert("You are in login"); */

        window.location.href = '/dashboard.html';
      })
      .catch((error) => {
        console.error(error);
        alert("you are in login error");

      })
        
    });
    
    const createAccount = document.getElementById("btnCreate");
    const emailNew = document.getElementById("newEmail");
    const passwordNew = document.getElementById("newPassword");

      createAccount.addEventListener('click', () => {
      
      const email = emailNew.value;
      const password = passwordNew.value; 
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Account Created.");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

})







