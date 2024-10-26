import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfdAD29VqtAgacKhD0hhv3JnnFfxlx0Gc",
  authDomain: "study-analy.firebaseapp.com",
  projectId: "study-analy",
  storageBucket: "study-analy.appspot.com",
  messagingSenderId: "945001783343",
  appId: "1:945001783343:web:b97189c4a8ea3f9627a6da",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
