const { random } = require("./utils")

const generate = (techs, result) => {
  for (tech in techs) {
    if (tech !== 'Name') {
      let value = random(techs[tech]);
      
      if (typeof value !== 'string') {
        result[tech] = {Name: value.Name, Tick: "untick"}

        result = generate(value, result)
      } else {
        result[tech] = {Name: value, Tick: "untick"}
      }
    }
  }

  return result
}

exports.generate = generate

