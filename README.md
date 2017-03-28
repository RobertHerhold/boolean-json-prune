# boolean-json-prune

[![NPM](https://nodei.co/npm/boolean-json-prune.png)](https://npmjs.org/package/boolean-json-prune)

[![Build Status](https://travis-ci.org/RobertHerhold/boolean-json-prune.svg?branch=master)](https://travis-ci.org/RobertHerhold/boolean-json-prune)

This package cleans up [boolean-json](https://github.com/kemitchell/boolean-json-schema.json) expressions.

## Usage

```javascript
const prune = require('boolean-json-prune');

const input = {
    and: [{
        or: [{
            and: [{
                and: ['foo', 'bar']
            }, {
                and: ['foo2', 'bar2']
            }]
        }, {
            or: ['foo3', 'bar4']
        }]
    }, 'foo4']
};

const output = prune(input);
/*
{
    and: [{
        or: [{
            and: ['foo', 'bar', 'foo2', 'bar2']
        }, 'foo3', 'bar4']
    }, 'foo4']
}
*/
```

## Operations

**Note**: any combination of these operations is also possible.

### Combining nested conjunctions/disjunctions

Input:

```json
{
    "and": ["foo", "bar", {
        "and": ["baz", "foo2"]
    }]
}
```

Output:

```json
{
    "and": ["foo", "bar", "baz", "foo2"]
}
```

### Removing duplicates

Input:

```json
{
    "and": ["foo", "foo", "bar"]
}
```

Output:

```json
{
    "and": ["foo", "bar"]
}
```

### Removing redundant nested conjunctions/disjunctions 

Input:

```json
{
    "or": ["foo", {
        "and": ["foo", "bar", "baz"]
    }]
}
```

Output:

```json
"foo"
```

Input:

```json
{
    "and": ["foo", {
        "or": ["foo", "bar", "baz"]
    }]
}
```

Output:

```json
"foo"
```
