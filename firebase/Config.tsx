import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3eLhvi20-wwWXU8S_m0aHEo7IcqPLN0s",
  authDomain: "app07-5a961.firebaseapp.com",
  databaseURL: "https://app07-5a961-default-rtdb.firebaseio.com",
  projectId: "app07-5a961",
  storageBucket: "app07-5a961.firebasestorage.app",
  messagingSenderId: "620798680758",
  appId: "1:620798680758:web:e3fff4ce6dc5c0282b5017",
  measurementId: "G-FDD6T13LZF"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
