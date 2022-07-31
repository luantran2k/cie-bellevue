import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC0JqZFqeO5DfVGTv_X1Pj1O_T8ee3t8Nw",
    authDomain: "learn-firebase-151.firebaseapp.com",
    projectId: "learn-firebase-151",
    storageBucket: "learn-firebase-151.appspot.com",
    messagingSenderId: "692752915601",
    appId: "1:692752915601:web:4c13df5a5ee1d326c07330",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
