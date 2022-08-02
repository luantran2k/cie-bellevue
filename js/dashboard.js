import { registerLabel } from "./objRef.js";
import { readAllData } from "./handleForm.js";
import app, { db } from "./configFirebase.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    startAfter,
    endBefore,
    limit,
    limitToLast,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const NUM_ROW_DISPLAY = 20;
let tableHead = $("#consultations-table thead");
let tableBody = $("#registers-table tbody");
let tableName = "consultations";
let tableKeyArr = [];
let firstDoc, lastDoc;

function start() {
    handleNav();
    handleDownload();
    loadConsultationrTable();
    handleControlPagination();
}

function handleDownload() {
    $(".dowload-csv").addEventListener("click", (e) => {
        e.preventDefault();
        generateCSV();
    });
}
async function generateCSV() {
    let data = await readAllData(tableName);
    let keyArray = Object.keys(data[0]).sort();
    let csv = keyArray.join(", ") + "\n";
    data.forEach(function (obj) {
        let row = [];
        for (let key of keyArray) {
            if (key == "sendTime") {
                let sendTime = new Date(obj[key].seconds * 1000)
                    .toLocaleString()
                    .replace(",", " -");
                row.push(sendTime);
            } else {
                row.push(obj[key]);
            }
        }
        csv += row.join(",");
        csv += "\n";
    });
    let hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${tableName}.csv`;
    hiddenElement.click();
}

function handleNav() {
    const navItems = $$("#header .navItem");
    [...navItems].forEach((navItem) =>
        navItem.addEventListener("click", (e) => {
            $(".active").classList.remove("active");
            navItem.classList.add("active");
            tableName = navItem.getAttribute("tableName");
            if (tableName === "consultations") {
                loadConsultationrTable();
            } else if (tableName === "registers") {
                loadRegisterTable();
            }
        })
    );
}

function loadConsultationrTable() {
    tableKeyArr = ["name", "email", "phone", "sendTime"];
    loadTableHead(tableKeyArr, tableHead);
    loadTableData(tableName, tableKeyArr, tableBody);
    hanleDetailClick();
}

function loadRegisterTable() {
    tableKeyArr = ["name", "gender", "email", "phone", "sendTime", "more"];
    loadTableHead(tableKeyArr, tableHead);
    loadTableData(tableName, tableKeyArr, tableBody);
    hanleDetailClick();
}

function loadTableHead(tableKeyArr, tableHead) {
    let tableHeadData = tableKeyArr.map((tableHead) => {
        if (tableHead === "sendTime") {
            return `<th>Ngày nộp</th><th>Giờ nộp</th>`;
        } else {
            return `<th>${registerLabel[tableHead] || ""}</th>`;
        }
    });
    tableHead.innerHTML = `<tr>${tableHeadData.join("")}</tr>`;
}

async function loadTableData(collectionName, tableKeyArr, tableBody) {
    let registerData = await getDataFirst(collectionName);
    firstDoc = getFirstDocument(registerData);
    lastDoc = getLastDocument(registerData);
    renderRegisterData(registerData, tableKeyArr, tableBody);
}

function renderRegisterData(registerData, tableKeyArr, tableBody) {
    let datas = registerData.docs.map((doc) => doc.data());
    firstDoc = getFirstDocument(registerData);
    lastDoc = getLastDocument(registerData);
    let tableData = [];
    for (let data of datas) {
        let rowArr = tableKeyArr.reduce((acc, key) => {
            switch (key) {
                case "sendTime":
                    let tmpDate = new Date(data[key].seconds * 1000);
                    acc.push(
                        `<td>${tmpDate.toLocaleDateString()}</td><td>${tmpDate.toLocaleTimeString()}</td>`
                    );
                    break;
                case "email":
                    acc.push(
                        `<td><a href="mailto:${data[key]}?subject=Mail%20to%20test&body=Mail%20to%20test%20body"">${data[key]}</a></td>`
                    );
                    break;
                case "phone":
                    acc.push(
                        `<td><a href="tel:${data[key]}">${data[key]}t</a></td>`
                    );
                    break;
                case "more":
                    acc.push(
                        `<td><a href="./register-detail.html" class="register-detail" id="${data.id}">Chi tiết</a></td>`
                    );
                    break;
                default:
                    acc.push(`<td>${data[key]}</td>`);
                    break;
            }
            return acc;
        }, []);
        tableData.push(`<tr>${rowArr.join("")}</tr>`);
    }
    tableBody.innerHTML = tableData.join("");
}

function hanleDetailClick() {
    const delails = $$(".register-detail");
    [...delails].forEach((delail) =>
        delail.addEventListener("click", (e) => {
            localStorage.setItem("register-id", e.target.id);
        })
    );
}

// handle control event
function handleControlPagination() {
    const previousBtn = $(".previous");
    const nextBtn = $(".next");
    nextBtn.addEventListener("click", (e) => {
        getNextData(tableName).then((data) => {
            let array = data.docs.map((doc) => doc.data());
            if (Array.isArray(array) && array.length) {
                renderRegisterData(data, tableKeyArr, tableBody);
            }
        });
    });
    previousBtn.addEventListener("click", (e) => {
        getPreviousData(tableName).then((data) => {
            let array = data.docs.map((doc) => doc.data());
            if (Array.isArray(array) && array.length) {
                renderRegisterData(data, tableKeyArr, tableBody);
            }
        });
    });
}

async function getDataFirst(nameCollection, numRow = NUM_ROW_DISPLAY) {
    // Query the first page of docs
    const first = query(
        collection(db, nameCollection),
        orderBy("sendTime", "desc"),
        limit(numRow)
    );
    const documentSnapshots = await getDocs(first);
    return documentSnapshots;
}
function getFirstDocument(documentSnapshots) {
    // Get the first visible document
    const firstVisible = documentSnapshots.docs[0];
    return firstVisible;
}
function getLastDocument(documentSnapshots) {
    // Get the last visible document
    const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
    return lastVisible;
}

async function getNextData(nameCollection, numRow = NUM_ROW_DISPLAY) {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
        collection(db, nameCollection),
        orderBy("sendTime", "desc"),
        startAfter(lastDoc),
        limit(numRow)
    );
    const documentSnapshots = await getDocs(next);
    return documentSnapshots;
}

async function getPreviousData(nameCollection, numRow = NUM_ROW_DISPLAY) {
    // Construct a new query starting at this document,
    // get the previous 25 cities.
    const previous = query(
        collection(db, nameCollection),
        orderBy("sendTime", "desc"),
        endBefore(firstDoc),
        limitToLast(numRow)
    );
    const documentSnapshots = await getDocs(previous);
    return documentSnapshots;
}

start();
