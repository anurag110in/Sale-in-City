import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsLefB0E11MSfNH2dMXTqurjwRxIlyaXg",
  authDomain: "rentlow-bde76.firebaseapp.com",
  projectId: "rentlow-bde76",
  storageBucket: "rentlow-bde76.appspot.com",
  messagingSenderId: "976036359899",
  appId: "1:976036359899:web:cb2d66d76fe5ed034566fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore (with the custom database ID from the config)
const databaseId = "ai-studio-9cb55637-08b6-4438-a6f3-0a362fee0327";
const db = getFirestore(app, databaseId);

export { app, auth, db };
