import './style.scss';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const logout = document.getElementById('logout');

let currentUser = null;

//onAuthStateChanged
onAuthStateChanged(auth, async (user) => {
  if (user) {

    currentUser = user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      document.getElementById("pName").textContent = `Hello, ${userData.name}`;
      document.getElementById("user-name").textContent = `Name: ${userData.name}`;
      document.getElementById("user-email").textContent = `Email: ${userData.email}`;
    } else {
      console.log("No user data found in Firestore.");
    }
  } else {
    window.location.href = "/index.html";
  }
});
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
  
  const dashboard = document.getElementById('dashboardSec');
  const profile = document.getElementById('profileSec');
  const booking = document.getElementById('bookingSec');
  const payment = document.getElementById('paymentSec');
  const dashboard_tab =  document.getElementById('dashboardTab')
  const profile_tab = document.getElementById('profileTab');
  const bookings_tab =  document.getElementById('bookingsTab')
  const payment_tab =  document.getElementById('paymentTab')
  
  dashboard_tab.addEventListener('click', (e) => {
    e.preventDefault();
    dashboard_tab.classList.toggle('active');
    dashboard.style.display = "flex";
    profile.style.display = "none";
    profile_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    payment_tab.classList.remove('active');

  })

  profile_tab.addEventListener('click', async (e) => {
    e.preventDefault();

    profile_tab.classList.toggle('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    payment_tab.classList.remove('active');
    profile.style.display = "flex";
    dashboard.style.display = "none";
    booking.style.display = "none";
    payment.style.display = "none"; 
    
    if(currentUser) {
    
    const docref = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(docref);

    if(docSnap.exists()) {
      const userData = docSnap.data();

      document.getElementById('inputName').value = userData.name || "";
      document.getElementById('inputEmail').value = userData.email || "";
      document.getElementById('inputAadhar').value = userData.aadhar || "";
      document.getElementById('inputMobile').value = userData.mobile || "";
      document.getElementById('inputAddress').value = userData.address || "";
    } 
  } 
  })

  bookings_tab.addEventListener('click', (e) => {
    e.preventDefault();
    profile_tab.classList.remove('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.toggle('active');
    payment_tab.classList.remove('active');
    profile.style.display = "none";
    dashboard.style.display = "none";
    booking.style.display = "flex";
    payment.style.display = "none";
  })
  payment_tab.addEventListener('click', (e) => {
    e.preventDefault();
    profile_tab.classList.remove('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    payment_tab.classList.toggle('active');
    profile.style.display = "none";
    dashboard.style.display = "none";
    booking.style.display = "none";
    payment.style.display = "flex";
  })

  document.getElementById('modifyBtn').addEventListener('click', () => {

    document.getElementById('inputName').disabled = false;
    document.getElementById('inputEmail').disabled = false;
    document.getElementById('inputAadhar').disabled = false;
    document.getElementById('inputMobile').disabled= false;
    document.getElementById('inputAddress').disabled= false;

    document.getElementById('saveBtn').disabled= false;
  })

  document.getElementById('saveBtn').addEventListener('click', () => {
    
  })