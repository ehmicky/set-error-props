import { normalizeOptions } from './options.js'
import { shouldSkipProp, shouldSkipValue } from './skip.js'

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
// We do not deep merge as:
//  - This ensures the outer error overrides inner errors properties, since
//    those are likely to be specific to the inner error, e.g. to its class
//  - Users can deep merge using manual logic instead
const mergeProp = function ({ error, props, propName, soft }) {
  if (shouldSkipProp(props, propName)) {
    return
  }

  const errorValue = error[propName]

  if (shouldSkipValue(soft, errorValue)) {
    return
  }

  try {
    setProp(error, propName, props[propName])
  } catch {}
}

const setProp = function (error, propName, propValue) {
  if (propValue === undefined) {
    // eslint-disable-next-line fp/no-delete
    delete error[propName]
  } else {
    error[propName] = propValue
  }
}
