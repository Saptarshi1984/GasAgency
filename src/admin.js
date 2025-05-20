import './style.scss';
import { collection, getDocs, collectionGroup, query } from "firebase/firestore";
import { db } from './firebase.js'; 

/* After login fetching admin data */
window.onload = async () => {

//const db = getFirestore();

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

/* Function that fetch total number of users/subscribers */ 
const totalSubscriber = document.getElementById("numSubscriber");          
const fetchUserCount = async () => {
  try {
    const userData = collection(db, "users");
    const userDataSnap = await getDocs(userData);
    totalSubscriber.textContent = userDataSnap.size; 
  } catch (error) {
    alert("Error fetching user count:", error);
    totalSubscriber.textContent = "Error";
  }
};
/* Function that fetch total numbers of orders */
const totalOrderText = document.getElementById('totalOrders');
const fetchTotalUserOrders = async () => {
      
    const ordersGroup = query(collectionGroup(db, "userOrders"));
    const snapshot = await getDocs(ordersGroup);
    
    totalOrderText.textContent = snapshot.size;    
     
}
const TotalRevenue = document.getElementById('totalRevenue');
const totalRevenue = async () => {
      
   let totalAmount = 0;

    const ordersGroup = query(collectionGroup(db, "userOrders"));
    const snapshot = await getDocs(ordersGroup);

    snapshot.forEach(doc => {
            const data = doc.data();

            if(data.Amount) {
              
              totalAmount += Number(data.Amount);
            }            
    })
    TotalRevenue.textContent = totalAmount;
}

fetchUserCount();
fetchTotalUserOrders();
totalRevenue();
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

