import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCM0AgIF1ZIxFI-4LZpA2cnbQOMvyK6CsI",
  authDomain: "tendermanagementapp-f7406.firebaseapp.com",
  projectId: "tendermanagementapp-f7406",
  storageBucket: "tendermanagementapp-f7406.firebasestorage.app",
  messagingSenderId: "444141596036",
  appId: "1:444141596036:web:80aa5697eda6ada3df81d1",
  measurementId: "G-GN70SZRH73"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
