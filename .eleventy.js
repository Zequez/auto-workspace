if (!process.env.APP) throw new Error("Gotta set the APP environment variable");

module.exports = function (config) {
  config.setWatchJavaScriptDependencies(false);

  return {
    dir: {
      input: `apps/${process.env.APP}/pages`,
      output: "src/pages",
    },
  };
};
