const axios = require("axios");
const jsonData = require("../_data/covid.json");
const fs = require("fs");
const path = require("path");
const embed = { vimeo: `https://vimeo.com/api/oembed.json?url=${url}` };
const getImage = article => {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get(article.link);
    const img =
      (data.match(/[^"]+\.jpg/) && data.match(/[^"]+\.jpg/)[0]) ||
      "/img/covid.png";
    article.image = img;
    resolve(article);
  });
};

const articles = jsonData
  .filter(item => item.type === "Video")
  .sort((a, b) => (a.title > b.title ? 1 : -1));

const findImagesForArticles = async () => {
  const fetchedImages = await Promise.all(
    articles.map(article => getImage(article))
  );
  fs.writeFile(
    path.join("../_data/", "videoData.json"),
    JSON.stringify(fetchedImages),
    err => {
      if (err) console.log(err);
      console.log("Article data written");
    }
  );
  return fetchedImages;
};

findImagesForArticles();

module.exports = findImagesForArticles;
