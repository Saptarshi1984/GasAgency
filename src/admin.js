import "./style.scss";
import { db } from "./firebase.js";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  collectionGroup,
  query,
} from "firebase/firestore";

const admin_dashboardTab = document.getElementById("adminDashboardTab");
const admin_actionTab = document.getElementById("actionsTab");
const admin_requestTab = document.getElementById("requestTab");

const admin_dashboardSec = document.getElementById("adminDashboardSec");
const admin_actionsSec = document.getElementById("adminActionsSec");
const admin_requestSec = document.getElementById("adminRequestSec");

/* After login fetching admin data onloading to Admin Dashboard */
window.onload = async () => {
  //const db = getFirestore();

  const AdminEmail = sessionStorage.getItem("AdminEmail");

  if (!AdminEmail) {
    alert.error("Admin does not exists, Login Error");
    window.location.href = "/index.html";
  } else {
    const adminSnapShot = await getDocs(collection(db, "admin"));
    const adminData = adminSnapShot.docs.map((doc) => doc.data());

    const currentAdmin = adminData.find((admin) => admin.email === AdminEmail);

    if (currentAdmin) {
      document.getElementById(
        "adminName"
      ).textContent = `Hello, ${currentAdmin.name}`;
      /* document.getElementById(
        "admin-name"
      ).textContent = `Name: ${currentAdmin.name}`;
      document.getElementById(
        "admin-email"
      ).textContent = `Email: ${currentAdmin.email}`; */
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
  const totalOrderText = document.getElementById("totalOrders");
  const fetchTotalUserOrders = async () => {
    const ordersGroup = query(collectionGroup(db, "userOrders"));
    const snapshot = await getDocs(ordersGroup);

    totalOrderText.textContent = snapshot.size;
  };
  const TotalRevenue = document.getElementById("totalRevenue");
  const totalRevenue = async () => {
    let totalAmount = 0;

    const ordersGroup = query(collectionGroup(db, "userOrders"));
    const snapshot = await getDocs(ordersGroup);

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.Amount) {
        totalAmount += Number(data.Amount);
      }
    });
    TotalRevenue.textContent = totalAmount;
  };

  fetchUserCount();
  fetchTotalUserOrders();
  totalRevenue();
};

/* Onclicking admin Dashboard tab */
admin_dashboardTab.addEventListener("click", (e) => {
  e.preventDefault();

  admin_dashboardTab.classList.add("active");
  admin_actionTab.classList.remove("active");
  admin_requestTab.classList.remove("active");

  admin_dashboardSec.style.display = "flex";
  admin_actionsSec.style.display = "none";
  admin_requestSec.style.display = "none";
});

/* onclicking admin actions tab */
admin_actionTab.addEventListener("click", (e) => {
  e.preventDefault();

  admin_dashboardTab.classList.remove("active");
  admin_actionTab.classList.add("active");
  admin_requestTab.classList.remove("active");

  admin_dashboardSec.style.display = "none";
  admin_actionsSec.style.display = "flex";
  admin_requestSec.style.display = "none";
});

/* On clicking admin Request Tab */
admin_requestTab.addEventListener("click", async (e) => {
  e.preventDefault();

  const UserRequestsRow = document.getElementById("requestsBody");
  UserRequestsRow.innerHTML = "";

  let SlNo = 0;

  admin_dashboardTab.classList.remove("active");
  admin_actionTab.classList.remove("active");
  admin_requestTab.classList.add("active");
  admin_dashboardSec.style.display = "none";
  admin_actionsSec.style.display = "none";
  admin_requestSec.style.display = "flex";

  const userRequestsRef = collection(db, "db_CylinderReq");
  const userRequestsSnap = await getDocs(userRequestsRef);

  userRequestsSnap.forEach((docSnap, index) => {
    SlNo += 1;
    let currentSlNo = index + 1;
    const data = docSnap.data();

    const row = document.createElement("tr");

    row.innerHTML = `<td>${SlNo}</td>
                     <td>${data.date}</td>
                     <td>${docSnap.id}</td>
                     <td>${data.name}</td>
                     <td>${data.uid}</td>
                     <td>${data.status == "" ? "Pending" : data.status}</td>
                     <td id="btnChoices-${currentSlNo}" class="btnChoice">
                     <i id="approve-${currentSlNo}" class="approve fa-solid fa-circle-check"></i>
                     <i id="decline-${currentSlNo}" class="decline fa-solid fa-circle-xmark"></i>
                     </td>`;

    UserRequestsRow.appendChild(row);

    UserRequestsRow.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const docId = row.children[2].textContent.trim(); // assuming column 3 holds the doc ID
      const statusCell = row.querySelector(".btnChoice");

      if (e.target.classList.contains("approve")) {
        try {
          await
           updateDoc(doc(db, "db_CylinderReq", docId), {
            status: "Approved",
          }),
          updateDoc(doc(db, 'Bookings', docSnap.id), {
            cylCount: 1,
          })
        
          statusCell.innerHTML = "Approved";
          statusCell.style.cssText =
            "background: white; color: green; font-weight:600";
        } catch (error) {
          console.error("Failed to update status:", error);
        }
      }

      if (e.target.classList.contains("decline")) {
        try {
          await updateDoc(doc(db, "db_CylinderReq", docId), {
            status: "Declined",
          });
          statusCell.innerHTML = "Declined";
          statusCell.style.cssText =
            "background: white; color: red; font-weight:600";
        } catch (error) {
          console.error("Failed to update status:", error);
        }
      }
    });
  });
});

//SignOut function
document.getElementById("adminLogout").addEventListener("click", () => {
  try {
    sessionStorage.removeItem("AdminEmail"); // Optional: clear session
    window.location.href = "/index.html";
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
});
