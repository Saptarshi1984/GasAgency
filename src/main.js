import './style.scss';
import {auth} from './firebase.js';
import {doc, setDoc, getFirestore} from "firebase/firestore";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";

const db = getFirestore();


const emailId = document.getElementById("userEmail");
const passwordInput = document.getElementById("userPassword");
const loginBtn = document.getElementById("btnLogin");
const createAccount = document.getElementById("btnCreate");
const newName = document.getElementById("newName");
const emailNew = document.getElementById("newEmail");
const passwordNew = document.getElementById("newPassword");
const statusMsg = document.getElementById('status');




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
      const docRefBookings = doc(db, "Bookings", userCredential.user.uid);

      
       setDoc(docRef, {
        name:newName.value,
        email:emailNew.value
      }),

       setDoc(docRefBookings, {
        CylCount: 12,
        RegDate: new Date()
      })
            
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
  
  /* Admin Login */

  document.getElementById('adminLog').addEventListener('click', (e) => {
    e.preventDefault();
    const admin_email = document.getElementById('adminEmail').value;
    const admin_pwd = document.getElementById('adminPwd').value;

    if(admin_email === 'admin@gmail.com' && admin_pwd === 'admin1' ) {
      window.location.href = '/admin.html';
    } else {
      alert('Invalid userId or Password');
    }

  })










