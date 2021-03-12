const jsonData = require("../_data/covid.json");
const fs = require("fs");
const path = require("path");

const podcast = jsonData
  .filter(item => item.type === "Podcast")
  .sort((a, b) => (a.title > b.title ? 1 : -1));

const writePodcastData = () => {
  fs.writeFile("../_data/podcast.json", JSON.stringify(podcast), err => {
    if (err) console.log(err);
    console.log("Podcast data written");
  });
};

module.exports = writePodcastData;
