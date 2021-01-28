exports.random = (tech) => {
  const len = tech.length;
  const position = Math.floor(Math.random() * len);
  return tech[position];
};

const print = (tech, value) =>
  console.log(`\x1b[32m${tech}:\x1b[0m ${value}`);

exports.printAll = results => {
  for(tech in results) {
    print(tech, results[tech])
  }
}