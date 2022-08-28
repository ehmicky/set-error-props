import setErrorProps from 'set-error-props'

export const setProps = function (object, props, opts) {
  return setErrorProps(getError(object), props, opts)
}

export const getError = function (object) {
  // eslint-disable-next-line fp/no-mutating-assign
  return Object.assign(new Error('test'), object)
}
