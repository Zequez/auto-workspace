import { defineConfig } from "vite";
import { resolve, parse } from "path";
import fg from "fast-glob";
import elmPlugin from "vite-plugin-elm";
import WindiCSS from "vite-plugin-windicss";

const data = { name: "Data for pug!" };

if (!process.env.APP) throw new Error("Gotta set the APP environment variable");

const appPath = resolve(__dirname, `apps/${process.env.APP}`);

console.log(`Using app ${process.env.APP}`);
console.log(appPath);

let inputs = {};
fg.sync(`src/pages/**/*.html`).map((page) => {
  const dir = parse(page).dir;
  const pageKey = (dir.replace(appPath + "/pages", "") || "/main").replace(
    /^\//,
    ""
  );
  inputs[pageKey] = page;
});

console.log(inputs);

export default defineConfig({
  root: resolve(__dirname, "src", "pages"),
  clearScreen: false,
  build: {
    rollupOptions: {
      input: inputs,
    },
  },
  resolve: {
    alias: {
      "/@/": resolve(__dirname, "src") + "/",
      "/@@/": appPath + "/",
    },
  },
  plugins: [elmPlugin(), WindiCSS()],
});
