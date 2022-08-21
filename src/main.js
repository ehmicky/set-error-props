import deepMerge from 'deepmerge'
import isPlainObj from 'is-plain-obj'

// Merge error properties.
// Just like `Object.assign()`:
//  - Inherited or non-enumerable properties are ignored
//  - Symbol properties are not ignored
// New values are always configurable and writable.
//  - But top-level `error.*` remain the same
// If `error.*` is an inherited property and it is overridden, its top value
// becomes an own property, preventing prototype pollution.
// Error core properties are never overridden.
// `props` can either be a plain object or another error instance.
// `error` is directly modified.
// Deep merging does not recurse on non-plain objects.
//  - However, the top-level arguments can be non-plain object.
// This never throws, since it is likely to be inside some error handling logic.
//  - Errors lead to noop
export default function setErrorProps(
  error,
  props,
  { lowPriority = false } = {},
) {
  if (!isAnyObject(error) || !isAnyObject(props)) {
    return
  }

  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp({ error, props, propName, lowPriority })
  }
}

const isAnyObject = function (value) {
  return typeof value === 'object' && value !== null
}

// We always deep merge and do not provide a `shallow` option.
//  - Error properties should not be removed nor overridden as they contain
//    useful information
//  - For the same reason, arrays are concatenated
const mergeProp = function ({ error, props, propName, lowPriority }) {
  if (shouldSkipProp(props, propName)) {
    return
  }

  const propsValue = props[propName]
  const errorValue = error[propName]
  const mergedValue = mergeValues(errorValue, propsValue, lowPriority)

  if (!shouldSetValue(errorValue, mergedValue, lowPriority)) {
    return
  }

  try {
    error[propName] = mergedValue
  } catch {}
}

const shouldSkipProp = function (props, propName) {
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

const mergeValues = function (errorValue, propsValue, lowPriority) {
  if (!shouldMergeValues(errorValue, propsValue)) {
    return lowPriority ? errorValue : propsValue
  }

  return lowPriority
    ? deepMerge(propsValue, errorValue, DEEP_MERGE_OPTS)
    : deepMerge(errorValue, propsValue, DEEP_MERGE_OPTS)
}

const shouldMergeValues = function (errorValue, propsValue) {
  return isArrayOrObject(errorValue) && isArrayOrObject(propsValue)
}

const isArrayOrObject = function (value) {
  return isPlainObj(value) || Array.isArray(value)
}

const DEEP_MERGE_OPTS = { isMergeableObject: isPlainObj }

// `undefined` values are set, since `propName in error` might be `false`, but
// only if `lowPriority` is `false`.
const shouldSetValue = function (errorValue, mergedValue, lowPriority) {
  return (
    errorValue !== mergedValue || (mergedValue === undefined && !lowPriority)
  )
}
