#!/usr/bin/env node

const fs = require("fs");
const minimist = require("minimist");
const { generate } = require("./generate");
const { printAll, tick } = require("./utils");
const path = require("path");
const Table = require("cli-table");

const defaultStackConfig = path.join(__dirname, "..", "stack-config.json");
const stackConfig = "./stack-config.json";
const defaultStack = path.join(__dirname, "..", "stack.json");
const stackPath = "./stack.json";

let args = minimist(process.argv.slice(2), {
  alias: {
    h: "help",
    v: "version",
    g: "generate",
    s: "show",
    t: "tick",
    a: "all",
    u: "untick",
    r: "remove",
    G: "global",
    T: "table",
  },
});

const table = new Table({
  head: ["Stack", "Tech", "Tick"],
  colAligns: ["left", "left", "center"],
  style: { compact: true, "padding-left": 1 },
});

if (args.generate) {
  let stackConfigPath = stackConfig;

  fs.access(stackConfigPath, fs.F_OK, (error) => {
    if (error) {
      stackConfigPath = defaultStackConfig;
    }

    fs.readFile(stackConfigPath, (error, buffer) => {
      if (error) {
        console.log(error);
      } else {
        const techs = JSON.parse(buffer.toString());
        const result = generate(techs, {});

        if (args.show) {
          if (args.table) {
            for (tech in result) {
              table.push({
                [tech]: [result[tech].Name, tick(result[tech].Tick)],
              });
            }
            console.log(table.toString());
          } else {
            printAll(result);
          }
        }

        let fileResult = JSON.stringify(result, null, 2);

        let resultPath;
        if (args.global) {
          resultPath = defaultStack;
        } else {
          resultPath = stackPath;
        }

        fs.writeFile(resultPath, fileResult, (error) => {
          if (error) throw error;
        });
      }
    });
  });
} else if (args.show) {
  let resultPath;
  if (args.global) {
    resultPath = defaultStack;
  } else {
    resultPath = stackPath;
  }

  fs.access(resultPath, (error) => {
    if (error) {
      console.log(`It's weird, are you sure you run 'stack --generate' first`);
    } else {
      fs.readFile(resultPath, (error, buffer) => {
        if (error) {
          console.log(error);
        } else {
          const result = JSON.parse(buffer.toString());

          if (args.table) {
            for (tech in result) {
              if (result[tech].Tick === "remove" && !args.all) {
              } else {
                table.push({
                  [tech]: [result[tech].Name, tick(result[tech].Tick)],
                });
              }
            }
            console.log(table.toString());
          } else {
            printAll(result);
          }
        }
      });
    }
  });
} else if (args.tick || args.untick || args.remove) {
  let tick = args.tick;
  let untick = args.untick;
  let remove = args.remove;

  let resultPath;
  if (args.global) {
    resultPath = defaultStack;
  } else {
    resultPath = stackPath;
  }

  fs.access(resultPath, (error) => {
    if (error) {
      console.log(`It's weird, are you sure you run 'stack --generate' first`);
    } else {
      fs.readFile(resultPath, (error, buffer) => {
        if (error) {
          console.log(error);
        } else {
          const result = JSON.parse(buffer.toString());

          if (typeof tick === "string") {
            if (result.hasOwnProperty(tick)) {
              result[tick].Tick = "tick";
            }
          } else if (typeof tick === "object") {
            tick.forEach((tech) => {
              if (result.hasOwnProperty(tech)) {
                result[tech].Tick = "tick";
              }
            });
          }

          if (typeof untick === "string") {
            if (result.hasOwnProperty(untick)) {
              result[untick].Tick = "untick";
            }
          } else if (typeof untick === "object") {
            untick.forEach((tech) => {
              if (result.hasOwnProperty(tech)) {
                result[tech].Tick = "untick";
              }
            });
          }

          if (typeof remove === "string") {
            if (result.hasOwnProperty(remove)) {
              result[remove].Tick = "remove";
            }
          } else if (typeof remove === "object") {
            remove.forEach((tech) => {
              if (result.hasOwnProperty(tech)) {
                result[tech].Tick = "remove";
              }
            });
          }

          let fileResult = JSON.stringify(result, null, 2);

          fs.writeFile(resultPath, fileResult, (error) => {
            if (error) throw error;

            if (!args.show) {
              console.log(
                "Generate successful, check your stack.json or stack --show to show stack"
              );
            }
          });
        }
      });
    }
  });
} else if (args.version) {
  console.log("1.0.0");
} else {
  console.log("\n");
  console.log("Usage: stack <Options>");
  console.log("\n");
  console.log("Options: \n");
  console.log("  -h, --help".padEnd(24), "Show help");
  console.log("  -v, --version".padEnd(24), "Show version");
  console.log(
    "  -g, --generate".padEnd(24),
    "Generate stack base on stack-config.json and store in stack.json"
  );
  console.log("  -s, --show".padEnd(24), "Show stack from stack.json");
  console.log("\n");
  console.log("Examples: \n");
  console.log("  $ stack --generate --show");
}
