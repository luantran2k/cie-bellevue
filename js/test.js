"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//handle change input file type event
const formFileTypeInputs = $$('input[type="file"]');
[...formFileTypeInputs].forEach((formFileTypeInput) => {
    formFileTypeInput.addEventListener("change", function (e) {
        let fakeInput = $(`label[for="${e.target.id}"].fake-input`);
        if (e.target.files[0]) {
            fakeInput.innerText = "📁 " + e.target.files[0].name;
        }
        if (formFileTypeInput.id === "portrait") {
            console.log(formFileTypeInput.id);
            $("#portrait-img").src = URL.createObjectURL(e.target.files[0]);
        }
    });
});
