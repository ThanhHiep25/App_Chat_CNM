import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import firestore từ firebase/firestore
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

// Firebase config
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.apiKey,
  authDomain: Constants.expoConfig.extra.authDomain,
  projectId: Constants.expoConfig.extra.projectId,
  storageBucket: Constants.expoConfig.extra.storageBucket,
  messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
  appId: Constants.expoConfig.extra.appId,
  databaseURL: Constants.expoConfig.extra.databaseURL,
  //   @deprecated is deprecated Constants.manifest
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore(); // Sử dụng getFirestore() để khởi tạo firestore
export const storage = getStorage();
