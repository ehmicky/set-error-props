import setErrorProps from 'set-error-props'

export const setProps = (object, props, opts) =>
  setErrorProps(getError(object), props, opts)

// eslint-disable-next-line fp/no-mutating-assign
export const getError = (object) => Object.assign(new Error('test'), object)
