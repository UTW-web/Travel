import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user) {
    const textRef = ref(db, 'homepage/text');
    const textarea = document.getElementById("homepage-text");

    onValue(textRef, snapshot => {
      textarea.value = snapshot.val() || "";
    });

    document.getElementById("save-btn").addEventListener("click", () => {
      set(textRef, textarea.value)
        .then(() => {
          document.getElementById("save-status").textContent = "Saved!";
        });
    });
  }
});