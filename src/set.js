// If the property is not writable or not enumerable, we keep it as such.
// We always set the property as configurable, even if was not, so it can be
// set again.
// If the property has a `get`/`set`, we assign it directly so those are
// triggered, and we keep them.
export const setProp = function (error, propName, propValue) {
  const enumerable = !isNonEnumerableName(propName)

  const descriptor = getDescriptor(error, propName)

  try {
    setValue({ error, propName, propValue, descriptor, enumerable })
  } catch {}
}

// Properties starting with _* are not enumerable.
const isNonEnumerableName = function (propName) {
  return typeof propName === 'string' && propName.startsWith('_')
}

// Retrieve current descriptor (if any) even on inherited properties
const getDescriptor = function (value, propName) {
  const descriptor = Object.getOwnPropertyDescriptor(value, propName)

  if (descriptor !== undefined) {
    return descriptor
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null ? undefined : getDescriptor(prototype, propName)
}

const setValue = function ({
  error,
  propName,
  propValue,
  descriptor,
  enumerable,
}) {
  if (descriptor === undefined) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, propName, {
      value: propValue,
      enumerable,
      writable: true,
      configurable: true,
    })
    return
  }

  const newDescriptor = {
    enumerable: enumerable && descriptor.enumerable,
    configurable: true,
  }

  if (descriptor.writable === false) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, propName, {
      ...descriptor,
      ...newDescriptor,
      value: propValue,
    })
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, propName, {
    ...descriptor,
    ...newDescriptor,
  })
  error[propName] = propValue
}
