import setErrorProps from 'set-error-props'

export const setProps = function (object, props, opts) {
  return setErrorProps(getError(object), props, opts)
}

export const getFullError = function (object) {
  return getError({ cause: new Error('test'), errors: [], ...object })
}

export const getError = function (object) {
  // eslint-disable-next-line fp/no-mutating-assign
  return Object.assign(new Error('test'), object)
}
