// IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG DO SEU PROJETO
const firebaseConfig = {
  apiKey: "AIzaSyAT7AxO98_Py0bWZ6uHDTA_9W4DRlXATLQ",
  authDomain: "kaori-paper.firebaseapp.com",
  projectId: "kaori-paper",
  storageBucket: "kaori-paper.appspot.com",
  messagingSenderId: "1011909242590",
  appId: "1:1011909242590:web:b474035ea4c32359bf9c4f"
};

// INICIAR FIREBASE
const app = initializeApp(firebaseConfig);

// EXPORTAR BANCO
export const db = getFirestore(app);