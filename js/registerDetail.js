import { readDocrById } from "./firebase/fireStore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
    getAuth();
    const id = localStorage.getItem("register-id");
    readDocrById("registers", id).then((registerObj) => {
        fillData(registerObj);
    });
}

function fillData(registerObj) {
    document.title = registerObj.name;
    $(".profile-picture img").src = registerObj.portrait;

    [...$$(".info-item span")].forEach((item) => {
        item.innerText = registerObj[item.parentNode.id];
    });

    [...$$(".document-item a")].forEach((item) => {
        item.href = registerObj[item.id];
    });
}

start();
