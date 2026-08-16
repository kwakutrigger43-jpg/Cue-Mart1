import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAj6-3AC8d-RFnpiuRVFj3xlyLrkheAjqQ",
  authDomain: "cue-mart-6ae73.firebaseapp.com",
  projectId: "cue-mart-6ae73",
  storageBucket: "cue-mart-6ae73.firebasestorage.app",
  messagingSenderId: "252012344679",
  appId: "1:252012344679:web:2d3fa857b770d0945c2bc2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
