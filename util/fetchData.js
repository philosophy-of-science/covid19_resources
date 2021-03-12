const { writeArticleData, articles } = require("./articles");
const writeOtherData = require("./other");
const writePodcastData = require("./podcast");
const writeVideoData = require("./videos");
const writeSyllabusData = require("./syllabus");

writeArticleData(articles);
writeOtherData();
writePodcastData();
writeVideoData();
writeSyllabusData();
