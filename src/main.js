import normalizeException from 'normalize-exception'

import { mergeValues } from './merge.js'
import { shouldSkipProp, shouldSetValue } from './skip.js'

// Merge error properties.
export default function setErrorProps(
  error,
  props,
  { lowPriority = false } = {},
) {
  const errorA = normalizeException(error)

  if (!isAnyObject(props)) {
    return errorA
  }

  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp({ error: errorA, props, propName, lowPriority })
  }

  return errorA
}

const isAnyObject = function (props) {
  return typeof props === 'object' && props !== null
}

// Just like `Object.assign()`:
//  - Inherited or non-enumerable properties are ignored
//  - Symbol properties are not ignored
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
