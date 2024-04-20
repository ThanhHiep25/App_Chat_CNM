import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore từ firebase/firestore
import { getStorage } from "firebase/storage";


// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAaoacOFUifnB_WlyS-YOe1upqsaauUskw",
    authDomain: "demo1-c4035.firebaseapp.com",
    projectId: "demo1-c4035",
    storageBucket: "demo1-c4035.appspot.com",
    messagingSenderId: "1040251528721",
    appId: "1:1040251528721:web:852a5952501c5bddcbf3b0",
    measurementId: "G-WVNY93T2Z9"
};


initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(); // Sử dụng getFirestore() để khởi tạo firestore
export const storage = getStorage();
