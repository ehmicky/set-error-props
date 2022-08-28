import { mergeValues } from './merge.js'
import { normalizeOptions } from './options.js'
import { shouldSkipProp, shouldSetValue } from './skip.js'

// Merge error properties.
export default function setErrorProps(error, props, opts) {
  const { soft } = normalizeOptions(error, props, opts)

  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp({ error, props, propName, soft })
  }

  return error
}

// Just like `Object.assign()`:
//  - Inherited or non-enumerable properties are ignored
//  - Symbol properties are not ignored
// We always deep merge and do not provide a `shallow` option.
//  - Error properties should not be removed nor overridden as they contain
//    useful information
//  - For the same reason, arrays are concatenated
const mergeProp = function ({ error, props, propName, soft }) {
  if (shouldSkipProp(props, propName)) {
    return
  }

  const errorValue = error[propName]
  const propsValue = props[propName]
  const mergedValue = mergeValues(errorValue, propsValue, soft)

  if (!shouldSetValue(errorValue, mergedValue, soft)) {
    return
  }

  try {
    error[propName] = mergedValue
  } catch {}
}
