# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
