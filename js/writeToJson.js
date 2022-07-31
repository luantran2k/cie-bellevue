const fs = require("fs");

// let rawdata = fs.readFileSync("punishmenthistory.json");
// let punishments = JSON.parse(rawdata);
// console.log(punishments);

let data = JSON.stringify(punishments);
fs.writeFileSync("punishmenthistory.json", data);
