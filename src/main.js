// Merge error properties, shallowly, with parent error having priority
// Do not merge inherited properties nor non-enumerable properties.
// Works with symbol properties.
export default function setErrorProps(error, props) {
  // eslint-disable-next-line fp/no-loops
  for (const propName of Reflect.ownKeys(props)) {
    mergeProp(error, props, propName)
  }
}

const mergeProp = function (error, props, propName) {
  if (propName in error) {
    return
  }

  const descriptor = Object.getOwnPropertyDescriptor(props, propName)

  if (descriptor !== undefined && !CORE_ERROR_PROPS.has(propName)) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, propName, descriptor)
  }
}

// Do not copy core error properties.
// Does not assume they are not enumerable.
const CORE_ERROR_PROPS = new Set([
  'name',
  'message',
  'stack',
  'cause',
  'errors',
])
