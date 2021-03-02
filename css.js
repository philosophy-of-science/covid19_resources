const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const precss = require("precss");
const fs = require("fs");

fs.readFile("src/style.css", (err, css) => {
  postcss([autoprefixer])
    .process(css, { from: "src/style.css", to: "_includes/style.css" })
    .then(result => {
      fs.writeFile("_includes/style.css", result.css, () => true);
      if (result.map) {
        fs.writeFile(
          "_includes/style.css.map",
          result.map.toString(),
          () => true
        );
      }
    });
});
