const { random } = require("./utils")

const generate = (techs, result) => {
  for (tech in techs) {
    if (tech !== 'Name') {
      let value = random(techs[tech]);
      
      if (typeof value !== 'string') {
        result[tech] = value.Name

        result = generate(value, result)
      } else {
        result[tech] = value
      }
    }
  }

  return result
}

exports.generate = generate

