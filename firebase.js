import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_VOTRE_VRAIE_CLE_ICI",
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
