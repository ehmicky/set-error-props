import setErrorProps from 'set-error-props'

export const setProps = function (error, props, opts) {
  setErrorProps(error, props, opts)
  return error
}
