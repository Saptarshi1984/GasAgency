import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, doc, setDoc };