const jsonData = require("../_data/covid.json");
const fs = require("fs");
const path = require("path");

const syllabi = jsonData
  .filter(item => item.type === "Syllabus")
  .sort((a, b) => (a.title > b.title ? 1 : -1));

fs.writeFile("../_data/syllabi.json", JSON.stringify(syllabi), err => {
  if (err) console.log(err);
  console.log("Syllabi data written");
});
