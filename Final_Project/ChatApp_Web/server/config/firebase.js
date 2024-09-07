const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");

// Firebase config
const firebaseConfig = {
  // apiKey: "AIzaSyBOtG1ZPHkmmuusyHeA2XWnJz11LaBh7jE",
  // authDomain: "demo1-1f76f.firebaseapp.com",
  // databaseURL: "https://demo1-1f76f-default-rtdb.firebaseio.com",
  // projectId: "demo1-1f76f",
  // storageBucket: "demo1-1f76f.appspot.com",
  // messagingSenderId: "554058119118",
  // appId: "1:554058119118:web:7a1b01e983df523121dd9f",
  // measurementId: "G-F773N5X4YF"

  // apiKey: "AIzaSyAaoacOFUifnB_WlyS-YOe1upqsaauUskw",
  // authDomain: "demo1-c4035.firebaseapp.com",
  // projectId: "demo1-c4035",
  // storageBucket: "demo1-c4035.appspot.com",
  // messagingSenderId: "1040251528721",
  // appId: "1:1040251528721:web:852a5952501c5bddcbf3b0",
  // measurementId: "G-WVNY93T2Z9",

  apiKey: "AIzaSyAWBafaQJArYSo-LRuQMupP-k24DJQscmY",
  authDomain: "demo1-sub.firebaseapp.com",
  projectId: "demo1-sub",
  storageBucket: "demo1-sub.appspot.com",
  messagingSenderId: "1077094001477",
  appId: "1:1077094001477:web:b51950f21a9beaf2e7ec2c",
  measurementId: "G-CNH4205XQM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

module.exports = { auth, firestore, storage };
