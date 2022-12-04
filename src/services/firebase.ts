import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import type IFirebaseService from "@/interfaces/firebase-service";
import type { StringMapType } from "@/types/map";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

let FirebaseApp: firebase.FirebaseApp;

const firebaseErrorsCodeTextMap: StringMapType = {
  "auth/email-already-in-use": "Email already in use",
  "auth/user-not-found": "Incorrect email or password",
  "auth/wrong-password": "Incorrect email or password",
};

const FirebaseService: IFirebaseService = {
  getAuthService: function (): Auth {
    return getAuth(this.getAppService());
  },
  getAppService: function (): firebase.FirebaseApp {
    try {
      FirebaseApp = firebase.getApp();
    } catch (error) {
      FirebaseApp = firebase.initializeApp(firebaseConfig);
    }

    return FirebaseApp;
  },
  getFirebaseErrorTextByKey: function (key: string): string {
    return key in firebaseErrorsCodeTextMap ? firebaseErrorsCodeTextMap[key] : key;
  },
};

export default FirebaseService;
