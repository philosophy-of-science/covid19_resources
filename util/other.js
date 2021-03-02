const axios = require("axios");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");

const fs = require("fs");
const path = require("path");

const jsonData = require("../_data/covid.json");

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

const getImage = article => {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get(article.link, {
      jar: cookieJar,
      withCredentials: true,
    });
    const img =
      (data.match(/[^"]+\.jpg/) && data.match(/[^"]+\.jpg/)[0]) ||
      "/img/covid.png";
    article.image = img;
    resolve(article);
    reject("error");
  });
};

const articles = jsonData
  .filter(item => item.type === "Other")
  .sort((a, b) => (a.title > b.title ? 1 : -1));

const findImagesForArticles = async () => {
  const fetchedImages = await Promise.all(
    articles.map(article => getImage(article))
  );
  fs.writeFile(
    path.join("../_data/", "other.json"),
    JSON.stringify(fetchedImages),
    err => {
      if (err) console.log("error");
      console.log("Other data written");
    }
  );
  return fetchedImages;
};

findImagesForArticles();

module.exports = findImagesForArticles;
