import { setProp } from './set.js'

// If the property is non-configurable, `Object.defineProperty()` cannot be used
//  - Except if the property is inherited
//  - Therefore, we just silently skip it
// `undefined` values are deleted.
// We only delete own properties, not inherited ones since that would impact
// other objects
//  - Therefore the value might still be present. If so, we set an own property
//    with `undefined` value instead
export const assignProp = function (error, propName, propValue) {
  if (propValue !== undefined) {
    return setProp(error, propName, propValue)
  }

  try {
    // eslint-disable-next-line fp/no-delete
    delete error[propName]
  } catch {}

  if (error[propName] !== undefined) {
    return setProp(error, propName)
  }
}
