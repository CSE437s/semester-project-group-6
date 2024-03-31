// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv917XRrtR4qKToudqAB1o6d_kjpLPqzA",
  authDomain: "tripify-93d9a.firebaseapp.com",
  projectId: "tripify-93d9a",
  storageBucket: "tripify-93d9a.appspot.com",
  databaseURL: "https://tripify-93d9a-default-rtdb.firebaseio.com/",
  messagingSenderId: "517531822629",
  appId: "1:517531822629:web:00480dd62576d065ca2dcc",
  measurementId: "G-BY3SQWSFJK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase();
export const storage = getStorage(app )