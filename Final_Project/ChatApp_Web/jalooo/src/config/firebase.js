import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore từ firebase/firestore
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  // apiKey: "AIzaSyAaoacOFUifnB_WlyS-YOe1upqsaauUskw",
  // authDomain: "demo1-c4035.firebaseapp.com",
  // projectId: "demo1-c4035",
  // storageBucket: "demo1-c4035.appspot.com",
  // messagingSenderId: "1040251528721",
  // appId: "1:1040251528721:web:852a5952501c5bddcbf3b0",
  // measurementId: "G-WVNY93T2Z9"

  apiKey: "AIzaSyAWBafaQJArYSo-LRuQMupP-k24DJQscmY",
  authDomain: "demo1-sub.firebaseapp.com",
  projectId: "demo1-sub",
  storageBucket: "demo1-sub.appspot.com",
  messagingSenderId: "1077094001477",
  appId: "1:1077094001477:web:b51950f21a9beaf2e7ec2c",
  measurementId: "G-CNH4205XQM",
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(); // Sử dụng getFirestore() để khởi tạo firestore
export const storage = getStorage();
