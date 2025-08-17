// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your Firebase configuration (replace with your project’s values)
const firebaseConfig = {
  apiKey: "AIzaSyDv-z3tnYH24jwhSvRBPGO22mvj2Q84CwI",
  authDomain: "ocr-paas-auth.firebaseapp.com",
  projectId: "ocr-paas-auth",
  storageBucket: "ocr-paas-auth.firebasestorage.app",
  messagingSenderId: "30270687345",
  appId: "1:30270687345:web:4682dd1c4588ab3023f3d0",
  measurementId: "G-TC4CKGNW5Z",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
