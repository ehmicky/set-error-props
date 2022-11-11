# 3.5.0

## Features

- Improve tree-shaking support

# 3.4.0

## Features

- Add browser support

# 3.3.1

## Bug fixes

- Fix `package.json`

# 3.3.0

- Switch to MIT license

# 3.2.0

## Features

- Improve error detection using
  [`is-error-instance`](https://github.com/ehmicky/is-error-instance)

# 3.1.0

## Features

- Setting an `undefined` value now deletes its key as well

# 3.0.0

## Breaking changes

- Remove deep merging

# 2.0.0

## Breaking changes

- The `error` is not normalized anymore
- Rename `lowPriority` option to [`soft`](README.md#soft)

## Features

- The first argument can now be a plain object
- Improve prototype pollution check

# 1.1.0

## Features

- Normalize and return `error`
- Validate arguments
- Improve TypeScript types

# 1.0.1

## Bug fixes

- Fix `lowPriority` option not working when error properties are `undefined`
- Fix typo in types

# 1.0.0

Initial release
