import { registerLabel } from "./objRef.js";
import { readAllData } from "./firebase/fireStore.js";
import app, { db, auth } from "./firebase/configFirebase.js";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    startAfter,
    endBefore,
    limit,
    limitToLast,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const NUM_ROW_DISPLAY = 20;
let tableName = "registers";
let tableHead = $(`#table thead`);
let tableBody = $(`#table tbody`);
let tableKeyArr = [];
let firstDoc, lastDoc;
let queryConditions = [];

function start() {
    $(`[tableName=${tableName}]`).classList.add("active");
    handleNav();
    handleToolBar();
    loadTable(tableName);
    handleControlPagination();
}

function handleToolBar() {
    handleDownload();
    handleStarCheckBtn();
    handleStarUnCheckBtn();
    handleViewStar();
    handleRemoveChecked();
}

function clearChecked() {
    const checkedInputs = $$('input[type="checkbox"]:checked');
    checkedInputs.forEach((checkedInput) => {
        checkedInput.checked = false;
    });
}

function starCheck(star) {
    star.classList.remove("gray");
    updateDoc(doc(db, tableName, star.getAttribute("value")), {
        hasStar: true,
    });
}

function starUnCheck(star) {
    star.classList.add("gray");
    updateDoc(doc(db, tableName, star.getAttribute("value")), {
        hasStar: false,
    });
}

//Check star checked by checkbox
function handleStarCheckBtn() {
    $(".star-check").addEventListener("click", (e) => {
        const checkedInputs = $$('input[type="checkbox"]:checked');
        checkedInputs.forEach((checkedInput) => {
            let star = $(`.star[value="${checkedInput.value}"]`);
            starCheck(star);
            clearChecked();
        });
    });
}

//Un check star checked by checkbox
function handleStarUnCheckBtn() {
    $(".star-uncheck").addEventListener("click", (e) => {
        const checkedInputs = $$('input[type="checkbox"]:checked');
        checkedInputs.forEach((checkedInput) => {
            let star = $(`.star[value="${checkedInput.value}"]`);
            starUnCheck(star);
            clearChecked();
        });
    });
}

function handleViewStar() {
    $(".view-star").addEventListener("click", function (e) {
        if (this.getAttribute("view-star") == "true") {
            this.setAttribute("view-star", false);
            queryConditions = [];
            this.innerText = "Xem đánh dấu sao";
        } else {
            this.setAttribute("view-star", true);
            queryConditions.push(where("hasStar", "==", true));
            this.innerText = "Trở về";
        }

        loadTable(tableName);
    });
}
function handleRemoveChecked() {
    const removeCheckedBtn = $(".remove-check");
    removeCheckedBtn.addEventListener("click", (e) => {
        if (confirm("Chắc chắn xoá những mục đã đánh dấu")) {
            const checkedInputs = $$('input[type="checkbox"]:checked');
            checkedInputs.forEach((checkedInput) => {
                deleteDoc(doc(db, tableName, checkedInput.value));
            });
            loadTable(tableName);
        }
    });
}

function handleDownload() {
    $(".download-csv").addEventListener("click", (e) => {
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
            loadTable(tableName);
        })
    );
}

function loadTable(tableName) {
    if (tableName === "consultations") {
        loadConsultationrTable();
    } else if (tableName === "registers") {
        loadRegisterTable();
    }
}
async function loadConsultationrTable() {
    tableKeyArr = ["name", "email", "phone", "sendTime"];
    loadTableHead(tableKeyArr, tableHead);
    await loadTableData(tableName, tableKeyArr, tableBody);
    handleStarClick();
}

async function loadRegisterTable() {
    tableKeyArr = ["name", "gender", "email", "phone", "sendTime", "more"];
    loadTableHead(tableKeyArr, tableHead);
    await loadTableData(tableName, tableKeyArr, tableBody);
    handleStarClick();
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
    tableHead.innerHTML = `<tr><th></th><th></th>${tableHeadData.join(
        ""
    )}</tr>`;
}

async function loadTableData(collectionName, tableKeyArr, tableBody) {
    let registerData = await getDataFirst(collectionName, queryConditions);
    firstDoc = getFirstDocument(registerData);
    lastDoc = getLastDocument(registerData);
    renderData(registerData, tableKeyArr, tableBody);
}

function renderData(registerData, tableKeyArr, tableBody) {
    let datas = registerData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
                        `<td><a href="tel:${data[key]}">${data[key]}</a></td>`
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
        let hasStar = data.hasStar;
        let checkBox = `<td><input type="checkbox" name="vehicle1" value="${data.id}"></td>`;
        let star = `<td value="${data.id}" class="star ${
            hasStar ? "" : "gray"
        }">⭐</td>`;
        tableData.push(`<tr>${checkBox}${star}${rowArr.join("")}</tr>`);
    }
    tableBody.innerHTML = tableData.join("");
}

function handleStarClick() {
    const stars = $$(".star");
    [...stars].forEach((star) =>
        star.addEventListener("click", (e) => {
            if (star.classList.contains("gray")) {
                starCheck(star);
            } else {
                starUnCheck(star);
            }
        })
    );
}

function hanleDetailClick() {
    const delails = $$(".register-detail");
    [...delails].forEach((delail) => {
        delail.addEventListener("click", (e) => {
            localStorage.setItem("register-id", e.target.id);
        });
        delail.addEventListener("auxclick", (e) => {
            localStorage.setItem("register-id", e.target.id);
        });
    });
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

async function getDataFirst(
    nameCollection,
    conditions = [],
    numRow = NUM_ROW_DISPLAY
) {
    // Query the first page of docs
    const first = query(
        collection(db, nameCollection),
        ...conditions,
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

async function getNextData(
    nameCollection,
    conditions = [],
    numRow = NUM_ROW_DISPLAY
) {
    // Construct a new query starting at this document,
    // get the next 25 cities.
    const next = query(
        collection(db, nameCollection),
        ...conditions,
        orderBy("sendTime", "desc"),
        startAfter(lastDoc),
        limit(numRow)
    );
    const documentSnapshots = await getDocs(next);
    return documentSnapshots;
}

async function getPreviousData(
    nameCollection,
    conditions = [],
    numRow = NUM_ROW_DISPLAY
) {
    // Construct a new query starting at this document,
    // get the previous 25 cities.
    const previous = query(
        collection(db, nameCollection),
        ...conditions,
        orderBy("sendTime", "desc"),
        endBefore(firstDoc),
        limitToLast(numRow)
    );
    const documentSnapshots = await getDocs(previous);
    return documentSnapshots;
}

start();
