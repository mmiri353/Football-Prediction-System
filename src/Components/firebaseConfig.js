import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAx83DX_prRTQiNozKOzGkPLduJ2dSNkSU",
  authDomain: "fyp1-424f1.firebaseapp.com",
  projectId: "fyp1-424f1",
  storageBucket: "fyp1-424f1.appspot.com",
  messagingSenderId: "2345250833",
  appId: "1:2345250833:web:3c73334d20a8cb926001b0"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = firebase.auth();
const database = firebase.database();
const firestore = firebase.firestore();
const Timestamp = firebase.firestore.Timestamp;
export { auth, database, firestore,Timestamp };
export default app;