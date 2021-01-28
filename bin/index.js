#!/usr/bin/env node

const fs = require("fs");
const minimist = require('minimist')
const {generate} = require('./generate')
const {printAll} = require('./utils')
const path = require("path")

const defaultStackConfig = path.join(__dirname, '..', 'stack-config.json')
const stackConfig = './stack-config.json'
const stackPath = './stack.json'

let args = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    g: 'generate',
    s: 'show',
    t: 'tick',
    u: 'untick',
  }
})

if (args.generate) {
  let stackConfigPath = stackConfig
  fs.access(stackConfig, fs.F_OK, error => {
    if (error) {
      stackConfigPath = defaultStackConfig
    } 

    fs.readFile(stackConfigPath, (error, buffer) => {
      if (error) {
        console.log(error)
      } else {
        const techs = JSON.parse(buffer.toString())
        const result = generate(techs, {})

        if (args.show) {
          printAll(result)
        }

        let fileResult = JSON.stringify(result, null, 2);
        
        fs.writeFile("stack.json", fileResult, (error) => {
          if (error) throw error;

          if (!args.show) {
            console.log('Generate successful, check your stack.json or stack --show to show stack')
          }
        });
      }
    })
  })
} else if (args.show) {
  fs.access(stackPath, error => {
    if (error) {
      console.log(`It's weird, are you sure you run 'stack --generate' first`)
    } else {
      fs.readFile(stackPath, (error, buffer) => {
        if (error) {
          console.log(error)
        } else {
          const result = JSON.parse(buffer.toString())
          printAll(result)
        }
      })
    }

  })
} else if (args.version) {
  console.log('1.0.0')
} else {
  console.log("\n")
  console.log("Usage: stack <Options>")
  console.log("\n")
  console.log("Options: \n")
  console.log("  -h, --help \t\t Show help")
  console.log("  -v, --version \t Show version")
  console.log("  -g, --generate \t Generate stack base on stack-config.json and store in stack.json")
  console.log("  -s, --show \t\t Show stack from stack.json")
  console.log("\n")
  console.log("Examples: \n")
  console.log("  $ stack --generate --show")
}

