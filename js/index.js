"use strict";
import {
    sendConsultationForm,
    sendRegisterForm,
    readAllData,
} from "./firebase/fireStore.js";
import saveImage from "./firebase/cloudStorage.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
    handleNavlinkScroll();
    handleInputFileType();
    handleSendConsultationForm();
    handleGenderInput();
    handleSendRegisterForm();
}

function handleNavlinkScroll() {
    const allLinks = document.querySelectorAll("a:link");

    allLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const href = link.getAttribute("href");

            // Scroll back to top
            if (href === "#")
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

            // Scroll to other links
            if (href !== "#" && href.startsWith("#")) {
                const sectionEl = document.querySelector(href);
                sectionEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "start",
                });
            }
        });
    });
}

function handleInputFileType() {
    const formFileTypeInputs = $$('input[type="file"]');
    [...formFileTypeInputs].forEach((formFileTypeInput) => {
        formFileTypeInput.addEventListener("change", function (e) {
            let fakeInput = $(`label[for="${e.target.id}"].fake-input`);
            if (e.target.files[0]) {
                fakeInput.innerText = "📁 " + e.target.files[0].name;
                fakeInput.classList.add("active");
            }
            if (formFileTypeInput.id === "portrait") {
                // console.log(formFileTypeInput.id);
                $("#portrait-img").src = URL.createObjectURL(e.target.files[0]);
            }
        });
    });
}

// Send consultation form
function handleSendConsultationForm() {
    const consultationSubmitBtn = $(`.consultation-form input[type="submit"]`);
    consultationSubmitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const consultationInputs = $$(".consultation-form-input");
        const consultationData = {};
        [...consultationInputs].forEach((input) => {
            consultationData[input.name] = input.value;
        });
        if (Object.values(consultationData).includes("")) {
            alert("Cần nhập đủ các trường");
        } else {
            sendConsultationForm(consultationData);
        }
    });
}

//Handle select option gender
function handleGenderInput() {
    const genderSelect = $(".gender-select");
    const genderOption = $$(".gender-option li");
    const genderInput = $("#gender");
    genderSelect.addEventListener("click", (e) => {
        // e.preventDefault();
        $(".gender-option").classList.toggle("active");
    });
    [...genderOption].forEach((option) => {
        option.addEventListener("click", (e) => {
            genderSelect.classList.add("active");
            genderSelect.innerText = e.target.innerText;
            genderInput.value = e.target.getAttribute("value");
            $(".gender-option").classList.remove("active");
        });
    });
}

function handleSendRegisterForm() {
    const registerInputs = $$(`.register-form input:not([type="submit"])`);
    const registerSubmitBtn = $(`.register-form input[type="submit"]`);
    registerSubmitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const registerData = {};
        for (let input of [...registerInputs]) {
            if (input.type == "file") {
                if (input.files[0]) {
                    let fileSrc = await saveImage(input.files[0]);
                    registerData[input.name] = fileSrc; //input.files[0].name;
                    console.log(`${input.name} : ${fileSrc}`);
                } else {
                    registerData[input.name] = "";
                }
            } else {
                registerData[input.name] = input.value;
            }
        }
        console.log(registerData);
        sendRegisterForm(registerData);
    });
}

start();
