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
const CHECK_ERROR = new Error('check')
// Those properties are either optional, set dynamically by `Error` constructor
// (as opposed to being on the `prototype`) or have special meaning like
// `prototype`
const IGNORED_PROPS = new Set(['prototype', 'errors', 'cause'])

// `undefined` values are set, since `propName in error` might be `false`, but
// only if `lowPriority` is `false`.
export const shouldSetValue = function (errorValue, mergedValue, lowPriority) {
  return (
    errorValue !== mergedValue || (mergedValue === undefined && !lowPriority)
  )
}
