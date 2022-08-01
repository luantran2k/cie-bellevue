import { readResigerById } from "./handleForm.js";
const id = localStorage.getItem("register-id");
console.log(id);
readResigerById(id).then((data) => console.log(data));
