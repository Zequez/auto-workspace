require("dotenv").config();
const fs = require("fs");
const { resolve } = require("path");
const spawnSync = require("child_process").spawnSync;
const { parseArgsStringToArgv } = require("string-argv");
// const simpleGit = require("simple-git/promise");

const APP = process.env.APP;
console.log(`[DEPLOYING APP] ${APP}`);
const DIST_BRANCH = "gh-pages";
const REMOTE = "origin";
const appPath = resolve(__dirname, `../apps/${APP}`);
const distPath = resolve(__dirname, `../dist/${APP}`);

const run = (command, cwd) => {
  console.log("\x1b[33m%s\x1b[0m", command);
  let args = parseArgsStringToArgv(command);
  let cmd = args.shift();
  return spawnSync(cmd, args, { stdio: "inherit", cwd: cwd }).status === 0;
};

const runSure = (command, cwd, message) => {
  if (!run(command, cwd)) {
    console.error(
      "\x1b[31m",
      message || "Last command exited with error, aborting"
    );
    process.exit();
  }
};

const runPipe = (command, cwd) => {
  console.log("\x1b[33m%s\x1b[0m", command);
  let args = parseArgsStringToArgv(command);
  let cmd = args.shift();
  const result = spawnSync(cmd, args, { stdio: "pipe", cwd: cwd });
  if (result.status === 0) {
    return result.output
      .reduce((a, v) => (v && v.length ? a + v : a), "")
      .trim();
  } else {
    return null;
  }
};

const gitExistsOnAppPath = fs.existsSync(resolve(appPath, ".git"));
if (!gitExistsOnAppPath) {
  // TODO: Try to clone it from apps/index.yml instead
  throw new Error(`${appPath} is not a Git repository`);
} else {
  console.log(`Git repo found at ${appPath}`);
}

const appRemote = runPipe(`git remote get-url ${REMOTE}`, appPath);
if (!appRemote) {
  // TODO: Try to add the remote from apps index.yml
  throw new Error(`APP must have remote ${REMOTE}`);
} else {
  console.log(`APP remote is: ${appRemote}`);
}

const gitExistsOnDistPath = fs.existsSync(resolve(distPath, ".git"));
if (!gitExistsOnDistPath) {
  // const tmpGitDir = resolve(distPath, "../../../");
  console.log(`Creating Git repo at ${distPath}`);
  // runSure(`cp -R ${appPath}/.git ${distPath}/.git`);
  initializeGitRepoReadyForFreshCommit();
  // runSure(
  //   `git init --bare -b ${DIST_BRANCH} .git`,
  //   distPath,
  //   `Could not initialize repository at ${distPath}`
  // );
} else {
  console.log(`Git repo found at ${distPath}`);
}

function initializeGitRepoReadyForFreshCommit() {
  const tmpDistPath = `${distPath}-tmp`;
  runSure(`rm -rf ${tmpDistPath}`);
  runSure(`mkdir ${tmpDistPath}`);
  runSure(`cp -R ${appPath}/.git ${tmpDistPath}/.git`);
  runSure(`git co gh-pages`, tmpDistPath);
  runSure(
    `git pull ${REMOTE} ${DIST_BRANCH}:${DIST_BRANCH} --force`,
    tmpDistPath
  );
  runSure(`git rm -r .`, tmpDistPath);
  runSure(`cp -R ${tmpDistPath}/.git ${distPath}/.git`);
  runSure(`rm -rf ${tmpDistPath}`);
}

// process.exit();
// process.exit();

// const distRemote = runPipe(`git remote get-url ${REMOTE}`, distPath);

// if (!distRemote) {
//   console.log(`DIST has no remote ${REMOTE}, copying it from APP`);
//   run(`git remote add ${REMOTE} ${appRemote}`, distPath);
// } else {
//   console.log(`DIST remote is: ${distRemote}`);
// }

// if (!distRemote) {
//   console.error("DIST must have remote");
//   process.exit();
// }

runSure(`cp ${appPath}/CNAME ${distPath}/CNAME`);

runSure(`git add -A`, distPath, "No files need to be added");

runSure(
  `git commit -m "Automatic commit ${new Date().toISOString()}"`,
  distPath
);
runSure(
  `git push ${REMOTE} ${DIST_BRANCH}`,
  distPath,
  `Could not push to ${REMOTE} ${DIST_BRANCH}`
);
