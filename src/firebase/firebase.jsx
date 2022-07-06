import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmL01wT89MqIipA7iU5wKcMstP3r-0N70",
  authDomain: "project-management-syste-9c584.firebaseapp.com",
  projectId: "project-management-syste-9c584",
  storageBucket: "project-management-syste-9c584.appspot.com",
  messagingSenderId: "61663385363",
  appId: "1:61663385363:web:822f71716538711578ace6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, auth, storage };
