// Do not override core error properties.
// Just like `Object.assign()`:
//  - Inherited or non-enumerable properties are ignored
//  - Symbol properties are not ignored
// When `soft`, values are not set if already set in `error`.
export const shouldSkipProp = ({ error, props, propName, soft }) =>
  isIgnoredPropName(propName) ||
  !isEnum.call(props, propName) ||
  (soft && error[propName] !== undefined)

const isIgnoredPropName = (propName) =>
  propName in CHECK_ERROR || IGNORED_PROPS.has(propName)

// Uses `key in error` to handle any current and future error|object properties
// This also help handle non-standard properties like `error.lineNumber`
// (SpiderMonkey) or `error.line` (JavaScriptCore).
const CHECK_ERROR = new Error('check')
// Those properties are either optional, set dynamically by `Error` constructor
// (as opposed to being on the `prototype`) or have special meaning like
// `prototype`
const IGNORED_PROPS = new Set(['prototype', 'errors', 'cause'])

const { propertyIsEnumerable: isEnum } = Object.prototype
