import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD2lXdRT34nG2_mmLhgn1Wt7hOT6IF6z7E",
  authDomain: "election-police-report-sys.firebaseapp.com",
  projectId: "election-police-report-sys",
  storageBucket: "election-police-report-sys.firebasestorage.app",
  messagingSenderId: "832289330129",
  appId: "1:832289330129:web:7944e2b6e4aa0c82ca86f0"
};

// Initialize Firebase (ONLY ONCE)
const app = initializeApp(firebaseConfig);

// Services
const db = getFirestore(app);
const auth = getAuth(app);

// Export
export { 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  onSnapshot,
  signInWithEmailAndPassword 
};
