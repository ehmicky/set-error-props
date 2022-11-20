// Do not override core error properties
export const shouldSkipProp = function (props, propName) {
  return (
    propName in CHECK_ERROR ||
    IGNORED_PROPS.has(propName) ||
    !isEnum.call(props, propName)
  )
}

const { propertyIsEnumerable: isEnum } = Object.prototype

// Uses `key in error` to handle any current and future error|object properties
// This also help handle non-standard properties like `error.lineNumber`
// (SpiderMonkey) or `error.line` (JavaScriptCore).
const CHECK_ERROR = new Error('check')
// Those properties are either optional, set dynamically by `Error` constructor
// (as opposed to being on the `prototype`) or have special meaning like
// `prototype`
const IGNORED_PROPS = new Set(['prototype', 'errors', 'cause'])

// `undefined` values are deleted, so we keep those even when `error[propName]`
// is `undefined`.
// When `soft`, values are not set if already set in `error`.
export const shouldSkipValue = function (errorValue, propValue, soft) {
  return soft && (propValue === errorValue || errorValue !== undefined)
}
