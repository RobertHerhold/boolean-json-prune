## 1.1.1 - 2017-04-14
### Changed
- Stop using the "in" keyword for checking child expressions
- Add the "boolean-json" keyword to `package.json`

## 1.1.0 - 2017-03-28
### Added
- Removes redundant nested conjunctions/disjunctions (conjunction inside disjunction or disjunction inside conjunction)

## 1.0.1 - 2017-03-28
### Changed
- Deduplications, if resulting in an array of a single element, return that element

## 1.0.0 - 2017-03-23
### Added
- This library to prune [boolean-json](https://github.com/kemitchell/boolean-json-schema.json) expressions
- Combines nested conjunction/negation expressions
- Deduplicates conjunction/negation expressions