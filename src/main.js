import './style.scss';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX34KqnU1HLeOkuvc4TqBIujhpb817GSM",
  authDomain: "first-project-fd65f.firebaseapp.com",
  projectId: "first-project-fd65f",
  storageBucket: "first-project-fd65f.firebasestorage.app",
  messagingSenderId: "605414873826",
  appId: "1:605414873826:web:81a6ede860b5ea98aedcbb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const userLogin = () => {
    document.getElementById("btnLogin").addEventListener('click', () => {
        
    })

}

const userRegistration = () => {

}

const adminLogin = () => {

}









