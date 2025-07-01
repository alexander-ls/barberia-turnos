import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDNDrRYhZ8Z5rCeSg7wC8grJUCiudY2wN0",
  authDomain: "barberia-turnos-65776.firebaseapp.com",
  projectId: "barberia-turnos-65776",
  storageBucket: "barberia-turnos-65776.firebasestorage.app",
  messagingSenderId: "136280564495",
  appId: "1:136280564495:web:f65016f9f0bac316ec947a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
