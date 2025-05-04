import './style.scss';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3UhFNEGeyMNE5zsb4e4Y-TGuJxy8ZEfw",
  authDomain: "gassys-5b3df.firebaseapp.com",
  projectId: "gassys-5b3df",
  storageBucket: "gassys-5b3df.firebasestorage.app",
  messagingSenderId: "658508671421",
  appId: "1:658508671421:web:06a05d2d53257181c64ad4"
};

const emailId = document.getElementById("userEmail");
const passwordInput = document.getElementById("userPassword");
const loginBtn = document.getElementById("btnLogin");
const createAccount = document.getElementById("btnCreate");
const newName = document.getElementById("newName");
const emailNew = document.getElementById("newEmail");
const passwordNew = document.getElementById("newPassword");
const statusMsg = document.getElementById('status');
const logout = document.getElementById('logout');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



//login function using email and password.
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

      //Registration using email and password and storing data to firestore.
      createAccount.addEventListener('click', async () => {
      
      const email = emailNew.value;
      const password = passwordNew.value; 
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
    // Signed up 
      const user = userCredential.user; 
    
    //adding new data
    try {

      const docRef = doc(db, "users", userCredential.user.uid);
      setDoc(docRef, {
        name: newName.value,
        email:emailNew.value
      }); 
          /* alert("Account Created."); */
          statusMsg.innerHTML = "Account Created Successfully.";
          newName.value = "";
          emailNew.value = "";
          passwordNew.value = "";
          confirmPwd.value = "";

    } catch (e) {

      console.error("Error adding document: ", e);

    }
  
    })
  
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });   
  })
  
  










