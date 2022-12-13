import { assignProp } from './assign.js'
import { normalizeOptions } from './options.js'
import { shouldSkipProp } from './skip.js'

// Merge error properties.
const setErrorProps = (error, props, opts) => {
  const { soft } = normalizeOptions(error, props, opts)

  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    setErrorProp({ error, props, propName, soft })
  }

  return error
}

export default setErrorProps

// We do not deep merge as:
//  - This ensures the outer error overrides inner errors properties, since
//    those are likely to be specific to the inner error, e.g. to its class
//  - Users can deep merge using manual logic instead
const setErrorProp = ({ error, props, propName, soft }) => {
  if (!shouldSkipProp({ error, props, propName, soft })) {
    assignProp(error, propName, props[propName])
  }
}
