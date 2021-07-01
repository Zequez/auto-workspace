require("dotenv").config();
const APP = process.env.APP;

if (!APP) throw new Error("Gotta set the APP environment variable");

module.exports = function (config) {
  config.setWatchJavaScriptDependencies(false);

  return {
    dir: {
      input: `apps/${APP}/pages`,
      output: "src/pages",
    },
  };
};
