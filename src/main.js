import { mergeValues } from './merge.js'
import { shouldSkipProp, shouldSetValue } from './skip.js'

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
export default function setErrorProps(
  error,
  props,
  { lowPriority = false } = {},
) {
  if (!isError(error) || !isAnyObject(props)) {
    return
  }

  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp({ error, props, propName, lowPriority })
  }
}

const isError = function (error) {
  return objectToString.call(error) === '[object Error]'
}

const { toString: objectToString } = Object.prototype

const isAnyObject = function (props) {
  return typeof props === 'object' && props !== null
}

// We always deep merge and do not provide a `shallow` option.
//  - Error properties should not be removed nor overridden as they contain
//    useful information
//  - For the same reason, arrays are concatenated
const mergeProp = function ({ error, props, propName, lowPriority }) {
  if (shouldSkipProp(props, propName)) {
    return
  }

  const errorValue = error[propName]
  const propsValue = props[propName]
  const mergedValue = mergeValues(errorValue, propsValue, lowPriority)

  if (!shouldSetValue(errorValue, mergedValue, lowPriority)) {
    return
  }

  try {
    error[propName] = mergedValue
  } catch {}
}
