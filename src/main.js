// Merge error properties.
// Just like `Object.assign()`:
//  - Inherited or non-enumerable properties are ignored
//  - Symbol properties are not ignored
// Descriptors are kept.
// Error core properties are never overridden.
// `props` can either be a plain object or another error instance.
// `error` is directly modified.
// This never throws.
export default function setErrorProps(
  error,
  props,
  { override = true, shallow = false } = {},
) {
  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp({ error, props, propName, override, shallow })
  }
}

const mergeProp = function ({ error, props, propName }) {
  if (propName in error) {
    return
  }

  const descriptor = Object.getOwnPropertyDescriptor(props, propName)

  if (descriptor !== undefined && !CORE_ERROR_PROPS.has(propName)) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, propName, descriptor)
  }
}

// Does not assume they are not enumerable.
const CORE_ERROR_PROPS = new Set([
  'name',
  'message',
  'stack',
  'cause',
  'errors',
])
