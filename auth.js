import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginContainer = document.getElementById("login-container");
const adminPanel = document.getElementById("admin-panel");

onAuthStateChanged(auth, user => {
  if (user) {
    loginContainer.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginContainer.style.display = "block";
    adminPanel.style.display = "none";
  }
});

document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .catch(err => {
      document.getElementById("login-error").textContent = err.message;
    });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth);
});