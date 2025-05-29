import './style.scss';
import {auth} from './firebase.js';
import {doc, setDoc, getFirestore, getDoc, getDocs, collection} from "firebase/firestore";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect} from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const db = getFirestore();
const gAuth = getAuth();
const provider = new GoogleAuthProvider();

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
    
    /* Login with Gmail */
     document.getElementById('googleLogin').addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const result = await signInWithPopup(gAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userBookingsDocRef = doc(db, "Bookings", user.uid);

    const userDocSnap = await getDoc(userDocRef);
    const userBookingsSnap = await getDoc(userBookingsDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email
      });
    }

    if (!userBookingsSnap.exists()) {
      await setDoc(userBookingsDocRef, {
        CylCount: 12,
        RegDate: new Date()
      });
    }

    window.location.href = '/dashboard.html';

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    alert("Login Error! " + errorMessage);
  }
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

  document.getElementById('adminLog').addEventListener('click', async (e) => {
    e.preventDefault();
    const admin_email = document.getElementById('adminEmail').value;
    const admin_pwd = document.getElementById('adminPwd').value;

    const admin_snapshot = await getDocs(collection(db, "admin"));
    const admin_list = admin_snapshot.docs.map(doc => doc.data());

    const matched_admin = admin_list.find(admin => 
      admin.email === admin_email && admin.password === admin_pwd
    );

    if(matched_admin) {

      sessionStorage.setItem("AdminEmail", matched_admin.email);

      window.location.href = '/admin.html';
    } else {
      alert.error('Invalid Credentials, Please try again');
    }

  })










