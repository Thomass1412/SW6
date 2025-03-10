import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🔥 Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAFNbnkTVgZnGijrTqmUJQqmZCeLk96q5E",
    authDomain: "shift-management-caa00.firebaseapp.com",
    projectId: "shift-management-caa00",
    storageBucket: "shift-management-caa00.firebasestorage.app",
    messagingSenderId: "581392732257",
    appId: "1:581392732257:web:c48a7c4890b27dffc75a20",
    measurementId: "G-LCPW650M2W"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;