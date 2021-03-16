# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.0] - 2021-03-16
### Added
- -a to count remove in progress.
- Show color in progress.
- Show archive/total in progress.
- Get all hidden config.
- Hidden multiple config rows.
- Hidden config rows by value.
- Show multiple config rows.
- Show config rows by value.

### Changed
- Not count 'none' row in progress
- Not count remove row in progress by default

## [1.7.0] - 2021-03-10
### Added
- --descrease, -d to sort descreasing table.
- --progress, -p to show progress of tick.
- Support Markdown format.
- Support HTML format.
- Get state of multiple rows.
- Tick multiple rows by fuzzy search.
- Get stack by fuzzy search.

### Changed
- Untick remove in --untick-flag.
- Delete tickOneOrManyByValue, tickOneOrManyByProperty, tickByFuzzy.
- Not show row that already tick in choice UI.

## [1.6.0] - 2021-03-03
### Added
- Support XML format.
- Get stack of config by value.
- Sort rows of table by value.
- Show tree with color.
- Get state of the row by fuzzy search.

### Changed
- Use Object-treeify instead of Treeify.
- Display array in tree as list.
- Remove checkOneState, checkAllState function.

## [1.5.0] - 2021-02-23
### Added
- --no, -n to nto create stack.json file.
- Get state of the row by value.
- Support JSON5 format.
- Show interactive UI when 2 row with same value.
- Use rewiremock to mock test.
- --sort to sort stack by key in table.

### Changed
- Use Cli-table3 instead of Cli-table

### Fixed
- Fix --untick-all, --unremove-all not working.
- Fix --untick-all -s show 2 tables.
- Fix icon in tick row in center.

## [1.4.0] - 2021-02-18
### Added
- Support TOML format.
- --untick-all to untick all rows.
- --get-state to get state of a single row.
- --term to not write stack.json.
- -ha to show full help.
- Check empty parameters.
- Show tree in --get-all flag.
- Auto create .stackconfigfile, .stackfile if not exist.

### Changed
- Ignore test folder in npm package.
- Show row "none" in --all flag.
- Hide row in --get-all flag.
- Delete .stackconfigfile, .stackfile by default.

### Fixed
- Fix -gs not work.
- Fix help show wrong pad.

## [1.3.0] - 2021-02-07
### Added
- Tick row by name of tech.
- Find row by fuzzy search.
- Choose row by interact UI.
- Support CSV format.
- --input, --output to choose file format.
- Pointer stack, config file.

### Changed
- Remove yaml in global.
- Use github action over travis CI.

### Fixed
- Fix coverall.

## [1.2.0] - 2021-01-30
### Added
- Support yaml file.
- Add stack.yml.
- -y, --yaml to force read and store in yaml type.
- Use husky for git hook.
- Add test in pre-commit.
- Add test and generate version file in pre-push.
- Add CHANGELOG.
- --add-item, --remove-item to add and remove tech in row in stack-config.
- --get-row, --add-row, --remove-row, --hide-row, show-row to manipulate row of stack-config.
- --get-all to show all config in stack-config.
- Add test for manipulate file.

### Changed
- Hide row with value 'None'.
- Choose name for stack and stack-config file.
- Abstract read and write file.
- Move table, help, version function to command file.
- Store message in message file.

### Removed
- Section about "changelog" vs "CHANGELOG".

### Fixed
- Auto generate version from package.json.

## [1.1.0] - 2021-01-29
### Added
- Show stack in table.
- Add tick column.
- -G, --global to read and store stack in global.
- -t, --tick, -u, --untick, -r, --remove to manipulate stack file.
- Use XO to lint.
- Use Ava to test.
- Test function in utils file.
- Use travis CI.
- Use converalls.
- Add screenshot to README.
- Add example to README.

### Changed
- Move minimist config to config file.
- Move cli-table config to config file.

### Fixed
- Fix tab in help by using padEnd.
- Check unknown command.

## [1.0.0] - 2021-01-28
### Added
- Command line interface.
- --help, --version command.
- Generate random stack from stack stack-config.json.
- Store stack in stack.json.
- Customize stack-config by create new stack-config.json.

[1.1.0]: https://github.com/Nguyen-Hoang-Nam/stack-idea/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Nguyen-Hoang-Nam/stack-idea/releases/tag/v1.0.0
