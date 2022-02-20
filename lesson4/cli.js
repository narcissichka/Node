#! D:\nodejs\node.exe
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const readline = require("readline");
const inquirer = require("inquirer");
const { choices, option } = require("yargs");

const options = yargs
  .option("p", {
    alias: "path",
    describe: "Path to the file",
    type: "string",
    demandOption: false,
  })
  .option("d", {
    alias: "dir",
    describe: "Directory to look for file",
    type: "string",
    demandOption: false,
  })
  .option("s", {
    alias: "search",
    describe: "Search for string in file",
    type: "string",
    demandOption: false,
  }).argv;

function readF(directory) {
  try {
    const filePath =
      path.resolve(directory, options.p) ?? path.resolve(options.p);
    const isFile = fs.lstatSync(filePath).isFile();
    if (isFile) {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) console.log(err);
        else console.log(data);
      });
    } else {
      console.log("Should be file path. To specify directory use flag -d");
    }
  } catch (e) {
    console.log("Wrong path");
  }
}

const executionDir = process.cwd();
const defineDir = (directory) => {
  if (options.d) {
    try {
      const isDir = !fs.lstatSync(options.d).isFile();
      if (isDir) return options.d;
      else if (!isDir && options.p) {
        return null; //in this case we don`t care about directory (call readF())
      } else if (!isDir && !options.p) {
        console.log("Wrong directory, to specify the file path use flag -p");
        return null;
      }
    } catch (e) {
      console.log("Wrong path");
      return null;
    }
  }
  return directory;
};
let directory = defineDir(executionDir);

const promptOptions = (list) => [
  {
    name: "fileName",
    type: "list",
    message: "Pick a file to read",
    choices: list,
  },
];
const list = (dirname) => fs.readdirSync(dirname);

const readDir = (dirname) => {
  inquirer.prompt(promptOptions(list(dirname))).then(({ fileName }) => {
    const fullFilePath = path.resolve(directory, fileName);
    if (!fs.lstatSync(fullFilePath).isFile()) {
      directory = fullFilePath;
      readDir(fullFilePath);
    } else {
      if (!options.s) {
        fs.readFile(fullFilePath, "utf-8", (err, data) => {
          if (err) console.log(err);
          else console.log(data);
        });
      } else {
        const searchQuery = options.s;
        const readLine = readline.createInterface({
          input: fs.createReadStream(fullFilePath, { encoding: "utf-8" }),
        });
        readLine.on("line", (line) => {
          if (line.match(searchQuery)) {
            process.stdout.write(line + "\n");
          }
        });
      }
    }
  });
};

async function search(dirname) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = async (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  const searchQuery = options.s;

  try {
    let fileName = "";
    if (!options.p) {
      fileName = await question("Input file name: ");
    } else {
      fileName = options.p;
    }
    const fullFilePath =
      path.resolve(dirname, fileName) ?? path.resolve(fileName);

    const readLine = readline.createInterface({
      input: fs.createReadStream(fullFilePath, { encoding: "utf-8" }),
    });
    readLine.on("line", (line) => {
      if (line.match(searchQuery)) {
        process.stdout.write(line + "\n");
      }
    });

    readLine.on("close", () => {
      rl.close();
    });
  } catch (e) {
    console.log(e);
  }
}

if (directory) {
  if (options.p && options.s) {
    search(directory);
  } else if (options.p && !options.s) {
    readF(directory);
  } else {
    readDir(directory);
  }
} else if (options.p && !options.s) {
  readF(directory);
}
