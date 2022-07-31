"use strict";
import {
    sendConsultationForm,
    sendRegisterForm,
    readAllData,
} from "./handleForm.js";
import saveImage from "./cloudStorage.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// readAllData().then((res) => {
//     console.log(res);
//     localStorage.setItem("testData", JSON.stringify(res));
// });
//handle change input file type event
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

// Send consultation form
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

//Handle select option gender
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
        console.log(genderInput.value);
        $(".gender-option").classList.remove("active");
    });
});
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
    // [...registerInputs].forEach(async (input) => {
    //     if (input.type == "file") {
    //         if (input.files[0]) {
    //             let fileSrc = await saveImage(input.files[0]);
    //             registerData[input.name] = fileSrc; //input.files[0].name;
    //             console.log(`${input.name} : ${fileSrc}`);
    //         } else {
    //             registerData[input.name] = "";
    //         }
    //     } else {
    //         registerData[input.name] = input.value;
    //     }
    //     console.log(registerData);
    // });
    // await console.log(Object.keys(registerData));
    // await console.log(Object.values(registerData));
    // if (Object.values(registerData).includes("")) {
    //     alert("Cần nhập đủ tất cả các trường");
    // } else {
    //     console.log(registerData);
    // }
});
