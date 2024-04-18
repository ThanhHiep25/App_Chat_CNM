const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");


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


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

module.exports = { auth, firestore, storage };
