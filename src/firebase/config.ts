import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqVwZb-9ThTJm7qb4GuvAtyqmPeHGAiX4",
  authDomain: "bear-n-bean-coffeeshop.firebaseapp.com",
  projectId: "bear-n-bean-coffeeshop",
  storageBucket: "bear-n-bean-coffeeshop.firebasestorage.app",
  messagingSenderId: "904070401127",
  appId: "1:904070401127:web:8785e73a08eacacd3658c2",
  measurementId: "G-TFJJ7FZEQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
