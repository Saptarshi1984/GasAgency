import './style.scss';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs } from "firebase/firestore";



const db = getFirestore();


  const dashboard = document.getElementById('dashboardSec');
  const profile = document.getElementById('profileSec');
  const booking = document.getElementById('bookingSec');
  const request = document.getElementById('requestSec');
  const dashboard_tab =  document.getElementById('dashboardTab')
  const profile_tab = document.getElementById('profileTab');
  const bookings_tab =  document.getElementById('bookingsTab')
  const request_tab = document.getElementById('requestTab');
  const refill_order = document.getElementById('refillOrder');
  const refill_btn = document.getElementById('refillBtn');
  const modify_btn = document.getElementById('modifyBtn'); 
  const save_btn = document.getElementById('saveBtn');

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
 
  /* On cliking dashboard tab */
  dashboard_tab.addEventListener('click', (e) => {
    e.preventDefault();
    dashboard_tab.classList.toggle('active');
    dashboard.style.display = "flex";
    profile.style.display = "none";
    booking.style.display = "none";
    request.style.display = "none";
    profile_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    request_tab.classList.remove('active');

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
    request.style.display = "none";
    request_tab.classList.remove('active');

    
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
    request.style.display = "none";
    booking.style.display = "flex";
    request_tab.classList.remove('active');
    
    

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

  /* Onclicking requests tab */
  
  request_tab.addEventListener('click', (e) => {
    e.preventDefault();
    request_tab.classList.toggle('active');
    request.style.display = "flex";    
    profile.style.display = "none";
    booking.style.display = "none";
    dashboard.style.display = "none";
    profile_tab.classList.remove('active');
    bookings_tab.classList.remove('active');
    dashboard_tab.classList.remove('active');

  })

  /* Additional cylinder order process */
  document.getElementById('addCylCheckBox').addEventListener('change', function () {
    if(this.checked) {
      document.getElementById('addCylinder').style.display = "block";
    } else {
      document.getElementById('addCylinder').style.display = "none";
    }
  })
  document.getElementById('addCylinder').addEventListener('click', async () => {
  
  try {
    ['declaration', 'checkBox', 'addCylinder'].forEach((id) => {
      document.getElementById(id).style.display = 'none';
    })    
    
/*     const bookingRecRef =  doc(db, 'Bookings', currentUser.uid);

    await setDoc(bookingRecRef,{
          CylCount: 1
    }) */

    const messageStatus = document.getElementById('confirmMsg');
    messageStatus.style.cssText = 'display:block; width:50%; font-size:1.6rem;';
    messageStatus.textContent = 'Your request is received and under reveiw. An email will be sent to your registered email Id for further communication.';
  }

  catch (error) {
    const errorMsg = error.Message || 'Unknown error';
    alert('Error in processing additional cylinder' + errorMsg);
  }
  })
  
  /* Onclicking modify button input field will become active for editing */
  document.getElementById('modifyBtn').addEventListener('click', () => {

    ['inputName', 'inputEmail', 'inputAadhar', 'inputMobile', 'inputAddress', 'saveBtn'].forEach((id) => {

     document.getElementById(id).disabled = false;

    })


    modify_btn.disabled = true;
    modify_btn.classList.add("inActive");
    modify_btn.classList.remove("btnPrimary");
    document.getElementById('saveBtn').classList.add('btnPrimary');   
   

  })
/* Onclicking the save button */
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

  modify_btn.disabled = false;
  modify_btn.classList.add('btnPrimary');
  modify_btn.classList.remove('inActive');

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
      document.getElementById('cylCount').value = bookingData.CylCount || "0";

          if(Number(bookingData.CylCount) <= 0) {
          refill_btn.innerHTML= '';
          const divEle = document.createElement('div');
          divEle.innerHTML = "<h2>You have ran-out of your alloted cylinders.</h2><h3>Go to Requests tab and Request Extra Cylinders</h3>";
          divEle.style.cssText = "display:flex; flex-direction:column; gap: 0.8rem;text-align:center; letter-spacing:1px;";
          refill_btn.appendChild(divEle);                    
          }
    }       
      ['regNum', 'mName', 'mNum', 'mAdd', 'cylCount'].forEach((id) => {
      document.getElementById(id).disabled = 'true';
      })


    }
  }) 

  /* Confirm Order Button */   
  refill_order.addEventListener('submit', async (e) => {
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
  
    /* Sending Email after confirming Order */
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





