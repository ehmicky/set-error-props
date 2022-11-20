import redefineProperty from 'redefine-property'

// `undefined` values are deleted.
//  - We only delete own properties, not inherited ones since that would impact
//    other objects
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

const setProp = function (error, propName, propValue) {
  const nonEnum = getNonEnum(propName)
  redefineProperty(error, propName, { value: propValue, ...nonEnum })
}

// Properties starting with _* are not enumerable.
const getNonEnum = function (propName) {
  return typeof propName === 'string' && propName.startsWith('_')
    ? { enumerable: false }
    : {}
}
