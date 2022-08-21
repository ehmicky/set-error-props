// Do not override core error properties
export const shouldSkipProp = function (props, propName) {
  return CORE_ERROR_PROPS.has(propName) || !isEnum.call(props, propName)
}

const CORE_ERROR_PROPS = new Set([
  'name',
  'message',
  'stack',
  'cause',
  'errors',
])

const { propertyIsEnumerable: isEnum } = Object.prototype

// `undefined` values are set, since `propName in error` might be `false`, but
// only if `lowPriority` is `false`.
export const shouldSetValue = function (errorValue, mergedValue, lowPriority) {
  return (
    errorValue !== mergedValue || (mergedValue === undefined && !lowPriority)
  )
}
