import setErrorProps from 'set-error-props'

export const setProps = function (error, props) {
  setErrorProps(error, props)
  return error
}
