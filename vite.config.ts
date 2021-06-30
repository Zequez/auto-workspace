import fg from "fast-glob";
import { parse, resolve } from "path";
import { defineConfig } from "vite";
import elmPlugin from "vite-plugin-elm";
import WindiCSS from "vite-plugin-windicss";

if (!process.env.APP) throw new Error("Gotta set the APP environment variable");

const appPath = resolve(__dirname, `apps/${process.env.APP}`);

console.log(`[APP ${process.env.APP}`, appPath, "]");

const inputs = matchGeneratedPages();

console.log("Detected pages:");
Object.keys(inputs).forEach((k) => {
  console.log("    ", k.padEnd(30, " "), inputs[k]);
});
console.log("");

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
  plugins: [
    elmPlugin(),
    WindiCSS({
      root: __dirname,
      config: resolve(__dirname, "windi.config.js"),
      onConfigResolved: (config) => {
        console.log("WindiCSS Config", config);
      },
    }),
  ],
});

function matchGeneratedPages(): Record<string, string> {
  let inputs: Record<string, string> = {};
  fg.sync(`src/pages/**/*.html`).map((page) => {
    const dir = parse(page).dir;
    const pageKey = (dir.replace(appPath + "/pages", "") || "/main").replace(
      /^\//,
      ""
    );
    inputs[pageKey] = page;
  });
  return inputs;
}
