[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/set-error-props.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/set-error-props)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/src/main.d.ts)
[![Node](https://img.shields.io/node/v/set-error-props.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/set-error-props)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Properly update an error's properties.

# Features

- Prevents overriding [error core properties](#error-core-properties) (`name`,
  `message`, etc.)
- Protects against [prototype pollution](#prototype-pollution)
- [Deep merging](#deep-merging)
- Merge with either high or [low priority](#low-priority-merging)
- [Copy](#error-copy) another error's properties
- [Exception-safe](#exception-safety): this never throws

# Examples

## Error core properties

```js
import setErrorProps from 'set-error-props'

const error = new Error('one')
setErrorProps(error, { message: 'two' })
console.log(error.message) // 'one'
```

## Prototype pollution

```js
const error = new Error('one')
setErrorProps(error, { toString: () => 'injected' })
console.log(error.toString()) // 'Error: one'
console.log(Error.prototype.toString()) // 'Error'
```

## Deep merging

```js
// Deep merges plain objects and arrays
const error = new Error('message')
error.prop = { one: [true] }
setErrorProps(error, { prop: { one: [false], two: true } })
console.log(error.prop) // { one: [true, false], two: true }
```

## Low priority merging

```js
const error = new Error('message')
error.prop = { one: true }
setErrorProps(error, { prop: { one: false, two: true } }, { lowPriority: true })
console.log(error.prop) // { one: true, two: true }
```

## Error copy

<!-- eslint-disable fp/no-mutation -->

```js
const error = new Error('one')
const secondError = new Error('two')
secondError.prop = true
setErrorProps(error, secondError)
console.log(error.message) // 'one'
console.log(error.prop) // true
```

## Exception safety

<!-- eslint-disable fp/no-mutating-methods -->

```js
const error = new Error('one')
Object.defineProperty(error, 'nonWritable', { value: true, writable: false })
setErrorProps(error, { nonWritable: false })
console.log(error.nonWritable) // true
```

```js
// Does not throw even though the arguments are invalid
setErrorProps('', '')
```

# Install

```bash
npm install set-error-props
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## setErrorProps(error, props, options?)

`error` `Error`\
`props` `Error | object`\
`options` [`Options?`](#options)

Assign `props` to `error`.

### Options

Optional object with the following properties.

#### lowPriority

_Type_: `boolean`\
_Default_: `false`

Whether `props` should have higher merging priority over `error` or not.

# Related projects

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/set-error-props/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/set-error-props/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
