// import { auth, signInWithEmailAndPassword } from "./configFirebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

export async function checkLogIn(accept, reject) {
    await getAuth().onAuthStateChanged(function (user) {
        if (user) {
            accept();
        } else {
            reject();
        }
    });
}
export function logIn(email, password, hiddenForm) {
    let auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            hiddenForm();
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export function logOut() {
    try {
        signOut(getAuth());
        location.reload();
    } catch (error) {
        log(error);
    }
}
