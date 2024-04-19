// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCv917XRrtR4qKToudqAB1o6d_kjpLPqzA",
//   authDomain: "tripify-93d9a.firebaseapp.com",
//   projectId: "tripify-93d9a",
//   storageBucket: "tripify-93d9a.appspot.com",
//   databaseURL: "https://tripify-93d9a-default-rtdb.firebaseio.com/",
//   messagingSenderId: "517531822629",
//   appId: "1:517531822629:web:00480dd62576d065ca2dcc",
//   measurementId: "G-BY3SQWSFJK"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA8jWbSzCIuVO5m805HpsNVHiJ_RJJO_X8",
  authDomain: "tripplanning-30381.firebaseapp.com",
  projectId: "tripplanning-30381",
  storageBucket: "tripplanning-30381.appspot.com",
  messagingSenderId: "449423372708",
  appId: "1:449423372708:web:484ea75a6a9817c5a95131",
  databaseURL: "https://tripplanning-30381-default-rtdb.firebaseio.com/",
  measurementId: "G-Z9LGR9XK8J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase();
export const storage = getStorage(app )