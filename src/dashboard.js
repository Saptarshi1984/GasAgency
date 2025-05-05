import './style.scss';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";

const logout = document.getElementById('logout');


//onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if(!user) {

      window.location.href = '/index.html';

    }
  })
  //SignOut function
  logout.addEventListener('click', () => {    

    signOut(auth).then(() => {
      // Sign-out successful.
      /* alert('You are Signed Out.'); */
      window.location.href = '/index.html';
    }).catch((error) => {
      alert('An error occured:'+ error.Message);
      // An error happened.
    })

  });