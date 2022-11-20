import { setProp } from './set.js'

// If the property is non-configurable, `Object.defineProperty()` cannot be used
//  - Except if the property is inherited
//  - Therefore, we just silently skip it
export const assignProp = function (error, propName, propValue) {
  const { descriptor, own } = getDescriptor(error, propName, true)

  if (own && !descriptor.configurable) {
    return
  }

  return propValue === undefined
    ? deleteProp(error, propName, descriptor)
    : setProp({ error, propName, propValue, descriptor })
}

// Retrieve current descriptor (if any) even on inherited properties
const getDescriptor = function (value, propName, own) {
  const descriptor = Object.getOwnPropertyDescriptor(value, propName)

  if (descriptor !== undefined) {
    return { descriptor, own }
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null ? {} : getDescriptor(prototype, propName, false)
}

// `undefined` values are deleted.
// We only delete own properties, not inherited ones since that would impact
// other objects
//  - Therefore the value might still be present. If so, we set an own property
//    with `undefined` value instead
const deleteProp = function (error, propName, descriptor) {
  try {
    // eslint-disable-next-line fp/no-delete
    delete error[propName]
  } catch {}

  if (error[propName] !== undefined) {
    return setProp({ error, propName, propValue: undefined, descriptor })
  }
}
