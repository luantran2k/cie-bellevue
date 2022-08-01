import { registerLabel } from "./objRef.js";
import app, { db } from "./configFirebase.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const testData = JSON.parse(localStorage.getItem("testData"));
console.log(testData);

//Handle nav
(() => {
    const navItems = $$("#header .navItem");
    [...navItems].forEach((navItem) =>
        navItem.addEventListener("click", (e) => {
            $(".active").classList.remove("active");
            navItem.classList.add("active");
        })
    );
})();

//Handle table
let tableKeyArr = ["name", "gender", "email", "phone", "sendTime", "more"];
const tableHead = $("#table thead");
const tableBody = $("#table tbody");
(function loadRegisterTableHead() {
    let tableHeadData = tableKeyArr.map(
        (tableHead) => `<th>${registerLabel[tableHead] || ""}</th>`
    );
    tableHead.innerHTML = `<tr>${tableHeadData.join("")}</tr>`;
})();

(function loadRegisterTableData() {
    let tableData = [];
    for (let data of testData) {
        let rowArr = tableKeyArr.reduce((acc, key) => {
            if (key === "sendTime") {
                let tmpDate = new Date(data[key].seconds * 1000);
                acc.push(`<td>${tmpDate.toLocaleString()}</td>`);
            } else if (key === "more") {
                acc.push(
                    `<td><a href="./register-detail.html" class="register-delail" id="${data.id}">Chi tiết</a></td>`
                );
            } else {
                acc.push(`<td>${data[key]}</td>`);
            }
            return acc;
        }, []);
        tableData.push(`<tr>${rowArr.join("")}</tr>`);
    }
    tableBody.innerHTML = tableData.join("");
})();

(function hanleDetailClick() {
    const delails = $$(".register-delail");
    [...delails].forEach((delail) =>
        delail.addEventListener("click", (e) => {
            localStorage.setItem("register-id", e.target.id);
        })
    );
})();
