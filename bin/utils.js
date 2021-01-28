const symbols = {
  tick: {
    linux: '✔',
    window: '√'
  },
  checkbox: {
    linux: '☐',
    window: '[ ]'
  },
  cross: {
    linux: '✖',
    window: '×'
  }
}

exports.random = (tech) => {
  const len = tech.length;
  const position = Math.floor(Math.random() * len);
  return tech[position];
};

const print = (tech, value) =>
  console.log(`\x1b[32m${tech}:\x1b[0m ${value}`);

exports.printAll = results => {
  for(tech in results) {
    print(tech, results[tech].Name)
  }
}

const symbol = (name) => {
  if (process.platform === 'win32') {
    return symbols[name].window 
  } else {
    return symbols[name].linux
  }
}

exports.tick = (check) => {
  if (check === 'untick') {
    return symbol("checkbox")
  } else if (check === 'tick') {
    return symbol("tick")
  } else if (check === 'remove') {
    return symbol("cross")
  }
}