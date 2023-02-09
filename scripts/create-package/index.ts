import fs from "fs";
import path from "path";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface Args {
  name: string;
  path?: string;
}

const args = yargs(hideBin(process.argv))
  .option("name", {
    description: "The name of the package",
    type: "string",
    demandOption: true,
  })
  .option("path", {
    description: "The path to the package",
    type: "string",
  }).argv as Args;

if (!args) {
  throw new Error("No arguments provided");
}

const sourcePath = path.join(__dirname, "scaffold");

const destinationPath = path.join(
  process.cwd(),
  args.path ? path.join(args.path, args.name) : args.name
);

if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath);
}

function copyFolder(from: string, to: string) {
  fs.readdirSync(from).forEach((file) => {
    const currentSrc = path.join(from, file);
    const currentDest = path.join(to, file);

    const isDirectory = fs.statSync(currentSrc).isDirectory();

    if (isDirectory) {
      fs.mkdirSync(currentDest, { recursive: true });
      copyFolder(currentSrc, currentDest);
    } else {
      fs.copyFileSync(currentSrc, currentDest);
    }
  });
}

copyFolder(sourcePath, destinationPath);
