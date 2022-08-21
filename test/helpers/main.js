import setErrorProps from 'set-error-props'

export const setProps = function (object, props, opts) {
  // eslint-disable-next-line fp/no-mutating-assign
  const error = Object.assign(new Error('test'), object)
  return setErrorProps(error, props, opts)
}
