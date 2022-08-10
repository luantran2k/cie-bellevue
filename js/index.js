"use strict";
import {
    sendConsultationForm,
    sendRegisterForm,
    readAllData,
} from "./firebase/fireStore.js";
import saveImage from "./firebase/cloudStorage.js";
import Validation from "./validation.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function start() {
    handleNavlinkScroll();
    handleHeaderStyle();
    handleInputFileType();
    handleInputConsultationForm();
    handleSendConsultationForm();
    handleGenderInput();
    handleInputRegisterForm();
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

function handleHeaderStyle() {
    const headerEl = document.querySelector(".header-bottom");

    const obs = new IntersectionObserver(
        function (entries) {
            const ent = entries[0];
            // console.log(ent);

            if (ent.isIntersecting === false) {
                console.log(ent.isIntersecting);
                $("#header").classList.add("small");
                // document.body.classList.add("sticky");
            }

            if (ent.isIntersecting === true) {
                $("#header").classList.remove("small");
                console.log(ent.isIntersecting);

                // document.body.classList.remove("sticky");
            }
        }
        // {
        //     // In the viewport
        //     root: null,
        //     threshold: 0,
        //     rootMargin: "-80px",
        // }
    );
    obs.observe(headerEl);
}

function handleInputFileType() {
    const formFileTypeInputs = $$('input[type="file"]');
    [...formFileTypeInputs].forEach((formFileTypeInput) => {
        formFileTypeInput.addEventListener("change", function (e) {
            let fakeInput = $(`label[for="${e.target.id}"].fake-input`);
            if (e.target.files[0]) {
                fakeInput.innerText = "📁 " + e.target.files[0].name;
                fakeInput.classList.add("active");
                fakeInput.classList.remove("error");
                fakeInput.parentNode.querySelector(".message").innerText = "";
            }
            // if (formFileTypeInput.id === "portrait") {
            //     // console.log(formFileTypeInput.id);
            //     $("#portrait-img").src = URL.createObjectURL(e.target.files[0]);
            // }
        });
    });
}

function validateInput(input) {
    let inputValidation = new Validation(input.value, ["required", input.name]);
    if (inputValidation.validate()) {
        return true;
    }
    input.parentNode.querySelector(".message").innerText =
        inputValidation.message;

    if (input.name == "gender") {
        input.parentNode.querySelector(".fake-input").classList.add("error");
    } else {
        input.classList.add("error");
    }
    return false;
}

function focusInput(input) {
    input.classList.remove("error");
    input.parentNode.querySelector(".message").innerText = "";
}

function resetForm(form) {
    form.reset();
    [...form.querySelectorAll(".fake-input")].forEach((fakeInput) => {
        fakeInput.innerHTML = "<span>📁 Tải lên file tại đây</span>";
        fakeInput.classList.remove("active");
    });
    $(".gender-select").innerText = "Giới tính";
}

function handleInputConsultationForm() {
    const consultationInputs = $$(".consultation-form-input");
    for (let input of consultationInputs) {
        input.addEventListener("focus", (e) => {
            focusInput(input);
        });
        input.addEventListener("blur", (e) => {
            validateInput(input);
        });
    }
}

function handleFormNotification(state, form) {
    if (state) {
        $(".notify-message").innerText = "Gửi thành công";
        $(".notify-content").classList.add("active");
        setTimeout(() => {
            $(".notify").classList.remove("active");
            $(".notify-content").classList.remove("active");
            $(".notify-message").innerText = "";
            resetForm(form);
        }, 2000);
    } else {
        $(".notify-message").innerText = "Có lỗi xảy ra, vui lòng thử lại";
        $(".notify-content").classList.add("active");
        setTimeout(() => {
            $(".notify").classList.remove("active");
            $(".notify-content").classList.remove("active");
            $(".notify-message").innerText = "";
        }, 2000);
    }
}

function handleSendConsultationForm() {
    const consultationSubmitBtn = $(`.consultation-form input[type="submit"]`);
    consultationSubmitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        $(".notify").classList.add("active");
        const consultationInputs = $$(".consultation-form-input");
        const consultationData = {};
        for (let input of consultationInputs) {
            if (validateInput(input)) {
                consultationData[input.name] = input.value;
            } else {
                $(".notify").classList.remove("active");
                return;
            }
        }
        let state = await sendConsultationForm(consultationData);
        handleFormNotification(state, $(".consultation-form"));
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
            genderInput.parentNode
                .querySelector(".fake-input")
                .classList.remove("error");
            genderInput.parentNode.querySelector(".message").innerText = "";
        });
    });
}

function handleInputRegisterForm() {
    const registerInputs = $$(`.register-form input:not([type="submit"])`);
    for (let input of registerInputs) {
        input.addEventListener("focus", (e) => {
            focusInput(input);
        });
        input.addEventListener("blur", (e) => {
            validateInput(input);
        });
    }
}

function handleSendRegisterForm() {
    const registerInputs = $$(`.register-form input:not([type="submit"])`);
    const registerSubmitBtn = $(`.register-form input[type="submit"]`);
    registerSubmitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        $(".notify").classList.add("active");
        const registerData = {};
        for (let input of [...registerInputs]) {
            if (input.type == "file") {
                if (input.files[0]) {
                    let fileSrc = await saveImage(input.files[0]);
                    registerData[input.name] = fileSrc; //input.files[0].name;
                    // console.log(`${input.name} : ${fileSrc}`);
                } else {
                    input.parentNode.querySelector(".message").innerText =
                        "Cần nhập file này!";
                    input.parentNode
                        .querySelector(".fake-input")
                        .classList.add("error");
                    $(".notify").classList.remove("active");
                    return;
                }
            } else {
                if (validateInput(input)) {
                    registerData[input.name] = input.value;
                } else {
                    $(".notify").classList.remove("active");
                    return;
                }
            }
        }
        let state = await sendRegisterForm(registerData);
        handleFormNotification(state, $(".register-form"));
    });
}

start();
