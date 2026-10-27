
const path = require("path");
const fs = require("fs");

exports.mergejson = function (params) {  
  const jsonDir = path.join(__dirname, "../../json");
  let jsonArray = {};
  let retObj = {};

  fs.readdirSync(jsonDir)
    .filter((file) => path.extname(file).toLowerCase() === ".json")
    .forEach((file) => {
      const name = path.basename(file, ".json");
      try {
        jsonArray[name] = JSON.parse(
          fs.readFileSync(path.join(jsonDir, file), "utf8"),
        );
      } catch (err) {
        global.logger.error("JSON load failed: %s, %s", file, err.message);
      }
    });
  
  Object.keys(jsonArray).forEach(key => {
    retObj[key] = {};
    if( jsonArray[key] != undefined && Array.isArray(jsonArray[key]) ) {
      jsonArray[key].forEach(item => {
      if (!retObj[key][item.idx]) {
        retObj[key][item.idx] = {};
      }
      Object.assign(retObj[key][item.idx], item);
      });
    } else {
      retObj[key] = jsonArray[key];
    }
  });

  fs.writeFileSync(path.join(jsonDir, "merged.json"), JSON.stringify(retObj, null, 2));
  global.logger.info(
    "GameData loaded: %s",
    Object.keys(jsonArray).join(", "),
  );  
};

module.exports = exports;
