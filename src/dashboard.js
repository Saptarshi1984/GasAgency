import './style.scss';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs } from "firebase/firestore";

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
    ["inputName", "inputEmail", "inputAadhar", "inputMobile", "inputAddress"].forEach(id => {
      document.getElementById(id).disabled = true;
    });

    document.getElementById("saveBtn").disabled = true;

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }

  })
  
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
    booking.style.display = "none";
    payment.style.display = "none";
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
  /* Onclicking the bookings tab */
  bookings_tab.addEventListener('click', async (e) => {
    e.preventDefault();
    profile_tab.classList.remove('active');
    dashboard_tab.classList.remove('active');
    bookings_tab.classList.toggle('active');
    payment_tab.classList.remove('active');
    profile.style.display = "none";
    dashboard.style.display = "none";
    booking.style.display = "flex";
    payment.style.display = "none";

    const tableBody = document.getElementById('#bookingTable tbody');
    tableBody.innerHTML = "";

    const userOrderRef = collection(db, 'orders', currentUser.uid, 'userOrders');
    const userDataSnap = await getDocs(userOrderRef);

    userDataSnap.forEach((doc) => {
      const data = doc.data();

      const row = document.querySelector('tr');

      row.innerHTML = `<td>${data.dateOfOrder}</td>
                       <td>${data.idOfOrder}</td>
                       <td>${data.Amount}</td>
                       <td>${data.status}</td>`;

      tableBody.appendChild(row);
    });

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

  /* Confirm Ordder Button */
  document.getElementById('refillOrder').addEventListener('submit', async (e) => {
    e.preventDefault();
           
      if(!regNum || !mName || !mNum || !mAdd || !cylCount){
    alert("incomplete Profile!");
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
  /* const CylOrderRef = doc(db, 'orders', currentUser.uid); */
  const bookingRec = doc(db, 'Bookings', currentUser.uid);

        addDoc(CylOrderRef, {
              dateOfOrder: orderDate,
              idOfOrder: orderId,
              Amount: payableAmt
        })
        
  const bookingSnap = await getDoc(bookingRec);
  if( bookingSnap.exists()){
      const bookingData =  bookingSnap.data()
      const updateCylCount = bookingData.CylCount - 1;
    
      await updateDoc(bookingRec,{
        CylCount: updateCylCount
      });
  }      

        alert(`'Order Placed Succesfully with order id:' ${orderId}`);
        document.getElementById('refill').style.display = 'none';
  })

 
  /* Cancel Button */
  document.getElementById('BtnCancel').addEventListener('click', () => {
  document.getElementById('refill').style.display = 'none';
})

