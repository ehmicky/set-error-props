import setErrorProps from 'set-error-props'

export const setProps = function (object, props, opts) {
  return setDirectProps(createError(object), props, opts)
}

const createError = function (object) {
  const error = new Error('test')
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(error, object)
  return error
}

export const setDirectProps = function (error, props, opts) {
  setErrorProps(error, props, opts)
  return error
}
