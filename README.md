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
- [Merges deeply](#deep-merging)
- Merges with either high or [low priority](#low-priority-merging)
- [Copies](#error-copy) another error's properties
- Strict, deep [TypeScript typing](/src/main.d.ts) of the return value
- Handles [invalid errors](#invalid-errors)

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

## Invalid errors

<!-- eslint-disable no-throw-literal -->

```js
try {
  throw 'not_an_error_instance'
} catch (error) {
  setErrorProps(error, { prop: true }) // Converted to an error instance
}
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

`error` `Error | unknown`\
`props` `Error | object`\
`options` [`Options?`](#options)\
_Return value_: `Error`

Assigns `props` to `error`, then returns `error`. If `error` is not an `Error`
instance, it is converted to one.

### Options

Optional object with the following properties.

#### lowPriority

_Type_: `boolean`\
_Default_: `false`

Whether `props` should have lower merging priority over `error` or not.

# Related projects

- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2022 🔮
- [`error-custom-classes`](https://github.com/ehmicky/error-custom-classes):
  Create multiple error classes
- [`error-custom-class`](https://github.com/ehmicky/error-custom-class): Create
  one error class
- [`error-class-utils`](https://github.com/ehmicky/error-class-utils): Utilities
  to properly create error classes
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`set-error-class`](https://github.com/ehmicky/set-error-class): Properly
  update an error's class
- [`set-error-message`](https://github.com/ehmicky/set-error-message): Properly
  update an error's message
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`error-cause-polyfill`](https://github.com/ehmicky/error-cause-polyfill):
  Polyfill `error.cause`
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥
- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors

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
