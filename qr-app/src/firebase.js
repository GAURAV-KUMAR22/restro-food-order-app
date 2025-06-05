// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD00K-B-MeKnVpIZ7ZfL8ewGV1ic0oWQO4",
  authDomain: "qr-app-b1a88.firebaseapp.com",
  projectId: "qr-app-b1a88",
  storageBucket: "qr-app-b1a88.firebasestorage.app",
  messagingSenderId: "983867568496",
  appId: "1:983867568496:web:480dbeb42608b293b71fb5",
  measurementId: "G-GYVQM5QNMD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
