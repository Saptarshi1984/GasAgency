import './style.scss';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from './firebase.js'; 

/* After login fetching admin data */
window.onload = async () => {

const db = getFirestore();

const AdminEmail = sessionStorage.getItem("AdminEmail");

if(!AdminEmail) {

    alert.error("Admin does not exists, Login Error");
    window.location.href = '/index.html';
    
} else {
         const adminSnapShot = await  getDocs(collection(db, "admin"));
         const adminData = adminSnapShot.docs.map(doc => doc.data());

         const currentAdmin = adminData.find(admin => admin.email === AdminEmail);

         if(currentAdmin) {

            document.getElementById("adminName").textContent = `Hello, ${currentAdmin.name}`;
            document.getElementById("admin-name").textContent = `Name: ${currentAdmin.name}`;
            document.getElementById("admin-email").textContent = `Email: ${currentAdmin.email}`;
         }

}
           const totalSubscriber = document.getElementById("numSubscriber");
           
           const fetchUserCount = async () => {
  try {
    const userData = collection(db, "users");
    const userDataSnap = await getDocs(userData);
    totalSubscriber.textContent = `{${userDataSnap.size}}`; 
  } catch (error) {
    console.error("Error fetching user count:", error);
    totalSubscriber.textContent = "Error";
  }
};

fetchUserCount();
}

 //SignOut function
document.getElementById("adminLogout").addEventListener('click', () => {
  try {
    sessionStorage.removeItem("AdminEmail"); // Optional: clear session
    window.location.href = '/index.html';
  } catch (error) {
    alert('An error occurred: ' + error.message);
  }
});

