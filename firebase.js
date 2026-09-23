import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSy...", // ⚠️ Remplacez AIzaSy... par votre vraie apiKey copiée depuis la console Firebase
  authDomain: "signalisation-et-orpaillage.firebaseapp.com",
  projectId: "signalisation-et-orpaillage",
  storageBucket: "signalisation-et-orpaillage.appspot.com",
  messagingSenderId: "361130342209",
  appId: "1:361130342209:web:edfee2e9deo46879c713c0"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
