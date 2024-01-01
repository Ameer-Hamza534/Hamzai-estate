// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ25GEPEYrb9SC3YY03fAGyGVNVLxGVes",
  authDomain: "hamzari-estate.firebaseapp.com",
  projectId: "hamzari-estate",
  storageBucket: "hamzari-estate.appspot.com",
  messagingSenderId: "937695202050",
  appId: "1:937695202050:web:2ec120c2e3aa701e80901b",
  measurementId: "G-Q9ZBE76KCX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, app };
