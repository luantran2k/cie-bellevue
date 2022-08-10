import app, { db } from "./configFirebase.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    doc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

export async function sendConsultationForm(consultationData) {
    try {
        const docRef = await addDoc(collection(db, "consultations"), {
            ...consultationData,
            sendTime: serverTimestamp(),
        });
        // console.log("Document written with ID: ", docRef.id);
        // alert("Gửi thành công");
        return true;
    } catch (e) {
        // alert("Có lỗi xảy ra, vui lòng thử lại");
        console.error("Error adding document: ", e);
        return false;
    }
}

export async function sendRegisterForm(registerData) {
    try {
        const docRef = await addDoc(collection(db, "registers"), {
            ...registerData,
            sendTime: serverTimestamp(),
        });
        // console.log("Document written with ID: ", docRef.id);
        // alert("Gửi thành công");
        return true;
    } catch (e) {
        // alert("Có lỗi xảy ra, vui lòng thử lại");
        console.error("Error adding document: ", e);
        return false;
    }
}

export async function readAllData(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((data) => data.data());
}

export async function readDocrById(collection, id) {
    const docRef = doc(db, collection, id);
    try {
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (error) {
        console.log(error);
    }
}
