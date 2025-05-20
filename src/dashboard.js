import './style.scss';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs } from "firebase/firestore";

const db = getFirestore();


const logout = document.getElementById('logout');

let currentUser = null;

  /* EmailJS Initialization */
     (function(){
      emailjs.init({
        publicKey: "UhBBBYsV5Pm9nqJgp",
      });
   })();

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
 
  const dashboard_tab =  document.getElementById('dashboardTab')
  const profile_tab = document.getElementById('profileTab');
  const bookings_tab =  document.getElementById('bookingsTab')

  
  dashboard_tab.addEventListener('click', (e) => {
    e.preventDefault();
    dashboard_tab.classList.toggle('active');
    dashboard.style.display = "flex";
    profile.style.display = "none";
    booking.style.display = "none";
    profile_tab.classList.remove('active');
    bookings_tab.classList.remove('active');

  })

  /* Fetching user data */
  profile_tab.addEventListener('click', async (e) => {
    e.preventDefault();

    profile_tab.classList.toggle('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    profile.style.display = "flex";
    dashboard.style.display = "none";
    booking.style.display = "none";

    
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
  /* Onclicking the bookings tab */
  bookings_tab.addEventListener('click', async (e) => {
    e.preventDefault();
    profile_tab.classList.remove('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.toggle('active');   
    profile.style.display = "none";
    dashboard.style.display = "none";
    booking.style.display = "flex";
    

    const tableBody = document.getElementById('bookingLists');    
    tableBody.innerHTML = '';
    const userOrderRef = collection(db, 'orders', currentUser.uid, 'userOrders');
    const userDataSnap = await getDocs(userOrderRef);

    userDataSnap.forEach((doc) => {
      const data = doc.data();

      const row = document.createElement('tr');

      row.innerHTML = `<td>${data.dateOfOrder}</td>
                       <td>${data.idOfOrder}</td>
                       <td>${data.Amount}.00</td>
                       <td>${data.status || 'Pending'}</td>
                       <td><button  class ='btnPrimary' type="button">Pay Now</button></td>`; 
                       
      tableBody.appendChild(row);
           
    });

  })
  
  /* Onclicking modify button input field will become active for editing */
  document.getElementById('modifyBtn').addEventListener('click', () => {

    ['inputName', 'inputEmail', 'inputAadhar', 'inputMobile', 'inputAddress', 'saveBtn'].forEach((id) => {

     document.getElementById(id).disabled = false;

    })
    
    document.getElementById('modifyBtn').disabled = true;
    document.getElementById('modifyBtn').classList.add("inActive");
    document.getElementById('modifyBtn').classList.remove("btnPrimary");
    document.getElementById('saveBtn').classList.add('btnPrimary');   
   

  })
/* Onclicking the save button */
 const save_btn = document.getElementById('saveBtn');

  save_btn.addEventListener('click', async (e) => {
  e.preventDefault();

  if(!currentUser) {
    alert('User not Logged in');
    window.location.href = '/index.html';
  }
      
   const userDocRef = doc(db, 'users', currentUser.uid);

   const updatedData = {
    name: document.getElementById("inputName").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    aadhar: document.getElementById("inputAadhar").value.trim(),
    mobile: document.getElementById("inputMobile").value.trim(),
    address: document.getElementById("inputAddress").value.trim(),
  };

  try {
    await updateDoc(userDocRef, updatedData);

    // Disable fields again
    ["inputName", "inputEmail", "inputAadhar", "inputMobile", "inputAddress", "saveBtn"].forEach(id => {
      document.getElementById(id).disabled = true;
    });

    document.getElementById("saveBtn").classList.remove("btnPrimary");

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }

  document.getElementById('modifyBtn').disabled = false;
  document.getElementById('modifyBtn').classList.add('btnPrimary');
  document.getElementById('modifyBtn').classList.remove('inActive');

  })
/* On clicking the request tab */
  document.getElementById('request').addEventListener('click', async (e) => {
    e.preventDefault();
  
    document.getElementById('refill').style.display = "flex";
    

    if(currentUser) {
      
      const docref = doc(db, 'users', currentUser.uid);
      const docBookRef = doc(db, 'Bookings', currentUser.uid)
      const docSnap = await getDoc(docref);
      const docBookSnap = await getDoc(docBookRef);
      document.getElementById('regNum').value = currentUser.uid

    if(docSnap.exists()) {
      const userData = docSnap.data();
      const bookingData = docBookSnap.data();

      document.getElementById('mName').value = userData.name || "";
      document.getElementById('mNum').value = userData.mobile || "";
      document.getElementById('mAdd').value = userData.address || "";
      document.getElementById('cylCount').value = bookingData.CylCount || "";
    }       
      ['regNum', 'mName', 'mNum', 'mAdd', 'cylCount'].forEach((id) => {
      document.getElementById(id).disabled = 'true';
      })
    }

  }) 

  /* Confirm Order Button */     

  document.getElementById('refillOrder').addEventListener('submit', async (e) => {
  e.preventDefault();

      const regNum = document.getElementById('regNum').value;
      const mName = document.getElementById('mName').value;
      const mNum = document.getElementById('mNum').value;
      const mAdd = document.getElementById('mAdd').value;
      const cylCount = document.getElementById('cylCount').value;

                
      if(!regNum || !mName || !mNum || !mAdd || !cylCount){
    alert("Please Comple Your Profile in your Profile section!");
    return;
  } 
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const orderDate = `${day}/${month}/${year}`;
  const orderId = `${day}${month}${year}${currentUser.uid.slice(0,4).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
  const payableAmt = 990.00;
  
  const CylOrderRef = collection(db, 'orders', currentUser.uid, 'userOrders');
  const bookingRec = doc(db, 'Bookings', currentUser.uid);

        addDoc(CylOrderRef, {
              dateOfOrder: orderDate,
              idOfOrder: orderId,
              Amount: payableAmt
        })
        
  const bookingSnap = await getDoc(bookingRec);
  if( bookingSnap.exists()){

      const bookingData =  bookingSnap.data()
      const updateCylCount = bookingData.CylCount - 1; //Updating the cylinder count.
    
      await updateDoc(bookingRec,{
        CylCount: updateCylCount
      });  
    }   
    
    const sendEmail = currentUser.email;
    var msgParams = {        
                      name:mName,
                      email: sendEmail,
                      price: payableAmt,
                      order_id:orderId
                       }  
        emailjs.send('service_texmdlm', 'template_roi2uta', msgParams)
        alert(`'Order Placed Succesfully, email sent, if not check SPAM folder' ${orderId}`);
        document.getElementById('refill').style.display = 'none';        
  })

 
  /* Cancel Button */
  document.getElementById('BtnCancel').addEventListener('click', () => {
  document.getElementById('refill').style.display = 'none';
})




