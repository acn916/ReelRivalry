// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUHrJLvDBCMiVn_3jzOfrRTE3_PdQSDck",
  authDomain: "reelrivals-46ec3.firebaseapp.com",
  projectId: "reelrivals-46ec3",
  storageBucket: "reelrivals-46ec3.appspot.com",
  messagingSenderId: "682945850106",
  appId: "1:682945850106:web:8ad68ffd003c40f5a07743",
  measurementId: "G-1J35M63BTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Storage

export { app, storage }; // Export storage
