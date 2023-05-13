// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth";
import Constants from "expo-constants";
import { initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG1dK10JBiJA-YkDvI_5EPcaY3FOX3HR4",
  authDomain: "worcare-3df72.firebaseapp.com",
  projectId: "worcare-3df72",
  storageBucket: "worcare-3df72.appspot.com",
  messagingSenderId: "417490397074",
  appId: "1:417490397074:web:19b8c43a793c251813034b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db= initializeFirestore(app, {experimentalForceLongPolling: true});