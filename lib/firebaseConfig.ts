// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDrR_Cnobbh76lEQ0fjSNm2iHxdtAtHscg",
    authDomain: "specsvue-c5ca1.firebaseapp.com",
    projectId: "specsvue-c5ca1",
    storageBucket: "specsvue-c5ca1.firebasestorage.app",
    messagingSenderId: "146287793329",
    appId: "1:146287793329:web:7ccb65b52f645c66e87e90"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth };
