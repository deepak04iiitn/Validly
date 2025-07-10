// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "validly-2c457.firebaseapp.com",
  projectId: "validly-2c457",
  storageBucket: "validly-2c457.firebasestorage.app",
  messagingSenderId: "398723546709",
  appId: "1:398723546709:web:a4123cfdb8e19c25081edc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);