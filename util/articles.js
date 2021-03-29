const axios = require("axios");
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");

const fs = require("fs");
const path = require("path");

const jsonData = require("../_data/covid.json");

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

const verifyImage = imgStr => {
  const checkBeginningAndEnd = str => /^http.+(jp||pn)g$/.test(str);

  const jpg =
    checkBeginningAndEnd(
      imgStr.match(/http[^"]+\.jpg/) && imgStr.match(/[^"]+\.jpg/)[0]
    ) &&
    imgStr.match(/http[^"]+\.jpg/) &&
    imgStr.match(/[^"]+\.jpg/)[0];

  const png =
    checkBeginningAndEnd(
      imgStr.match(/http[^"]+\.png/) && imgStr.match(/[^"]+\.png/)[0]
    ) &&
    imgStr.match(/http[^"]+\.png/) &&
    imgStr.match(/[^"]+\.png/)[0];

  const fallback = "https://philsci.org/photos/covid.svg";
  console.log({
    jpg,
    jpgImg: imgStr.match(/http[^"]+\.jpg/) && imgStr.match(/[^"]+\.jpg/)[0],
    png,
    pngImg: imgStr.match(/http[^"]+\.jpg/) && imgStr.match(/[^"]+\.jpg/)[0],
    fallback,
  });
  return jpg || png || fallback;
};

const getImage = article => {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios.get(article.link, {
      jar: cookieJar,
      withCredentials: true,
    });
    const img = verifyImage(data);
    console.log(img);

    article.image = img;
    resolve(article);
    reject("error");
  });
};

const articles = jsonData
  .filter(item => item.type === "Article/Essay")
  .sort((a, b) => (a.title > b.title ? 1 : -1));

const findImagesForArticles = async articles => {
  const fetchedImages = await Promise.all(
    articles.map(article => getImage(article))
  );
  return fetchedImages;
};

const setMetadata = (articles, limit) => {
  const metadata = articles.reduce((acc, cv) => {
    const source = cv.source;
    if (acc[source]) {
      acc[source]++;
    } else {
      acc[source] = 1;
    }
    return acc;
  }, {});

  const segmentedArticles = articles.reduce((acc, cv) => {
    const source = cv.source;
    if (metadata[source] > limit) {
      if (acc[source]) {
        acc[source] = [...acc[source], cv];
      } else {
        acc[source] = [cv];
      }
    } else {
      if (acc.articles) {
        acc.articles = [...acc.articles, cv];
      } else {
        acc.articles = [cv];
      }
    }
    return acc;
  }, {});
  return segmentedArticles;
};

const writeArticleData = async articles => {
  const articlesWithImages = await findImagesForArticles(articles);
  const articlesAndMetadata = setMetadata(articlesWithImages, 5);
  fs.writeFile(
    path.join("../_data/", "article.json"),
    JSON.stringify(articlesAndMetadata),
    err => {
      if (err) console.log("error");
      console.log("Article data written");
    }
  );
};

module.exports = { writeArticleData, articles };
