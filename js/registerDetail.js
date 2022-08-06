import { readResigerById } from "./handleForm.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
    const id = localStorage.getItem("register-id");
    readResigerById(id).then((registerObj) => {
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
