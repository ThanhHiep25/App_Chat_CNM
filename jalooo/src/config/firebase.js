import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore từ firebase/firestore
import { getStorage } from "firebase/storage";


// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBOtG1ZPHkmmuusyHeA2XWnJz11LaBh7jE",
    authDomain: "demo1-1f76f.firebaseapp.com",
    databaseURL: "https://demo1-1f76f-default-rtdb.firebaseio.com",
    projectId: "demo1-1f76f",
    storageBucket: "demo1-1f76f.appspot.com",
    messagingSenderId: "554058119118",
    appId: "1:554058119118:web:7a1b01e983df523121dd9f",
    measurementId: "G-F773N5X4YF"
};


initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(); // Sử dụng getFirestore() để khởi tạo firestore
export const storage = getStorage();
