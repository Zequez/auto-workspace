import * as dotenv from "dotenv";
import fg from "fast-glob";
import fs from "fs";
import { parse, resolve } from "path";
import YAML from "yaml";
import { defineConfig } from "vite";
import elmPlugin from "vite-plugin-elm";
import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";

dotenv.config();
const APP = process.env.APP;
if (!APP) throw new Error("Gotta set the APP environment variable");

const appPath = resolve(__dirname, `apps/${APP}`);
console.log(`[APP ${APP}`, appPath, "]\n");
const inputs = matchGeneratedPages();
logRecord("Detected pages", inputs);
const appsIndex = requireYaml("./apps/index.yml");
logRecord("Apps index", appsIndex);

export default (mode) => {
  console.log("MODE: ", mode, "\n");

  return defineConfig({
    root: resolve(__dirname, "src", "pages", APP),
    clearScreen: false,
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: inputs,
      },
      outDir: `../../../dist/${APP}`,
    },
    resolve: {
      alias: {
        "/@/": resolve(__dirname, "src") + "/",
        "/@@/": appPath + "/",
      },
    },
    plugins: [
      vue(),
      elmPlugin(),
      WindiCSS({
        root: __dirname,
        config: resolve(__dirname, "windi.config.js"),
        onConfigResolved: (config) => {
          console.log("WindiCSS Config", config, "\n");
        },
      }),
    ],
  });
};

function matchGeneratedPages(): Record<string, string> {
  let inputs: Record<string, string> = {};
  fg.sync(`src/pages/${APP}/**/*.html`).map((page) => {
    const dir = parse(page).dir;
    const pageKey = (dir.replace(appPath + "/pages", "") || "/main").replace(
      /^\//,
      ""
    );
    inputs[pageKey] = page;
  });
  return inputs;
}

function logRecord(
  title: string,
  record: Record<string, string>,
  pad: number = 30
) {
  console.log(`${title}:`);
  Object.keys(record).forEach((k) => {
    console.log("    ", k.padEnd(pad, " "), record[k]);
  });
  console.log("");
}

function requireYaml(file: string): Record<string, string> {
  return YAML.parse(fs.readFileSync(resolve(__dirname, file)).toString());
}
