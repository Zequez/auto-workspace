const { defineConfig } = require("windicss/helpers");

module.exports = defineConfig({
  preflight: true,
  attributify: true,
  extract: {
    include: ["{src,apps}/**/*.{vue,html,ts,jsx,tsx,pug,elm}"],
    extractors: [
      {
        extractor: (content) => {
          return { classes: content.match(/(?<=.)[!@\w-]+/g) ?? [] };
        },
        extensions: ["pug"],
      },
      {
        extractor: (content) => {
          return {
            classes:
              content.match(/(?<=[" ])[a-z\-][#!@\w-:\[\]]+(?:[ "])/g) ?? [],
          };
        },
        extensions: ["elm"],
      },
    ],
  },
});
