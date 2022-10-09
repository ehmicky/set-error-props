import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'

// Normalize and validate `props` and `options`.
// Invalid `error` are normalized but do not throw since they might be outside
// of the user's control, unlike `props` and `options`.
export const normalizeOptions = function (error, props, opts = {}) {
  validateErrorOrObject(error, 'First argument')
  validateErrorOrObject(props, 'Second argument')

  if (!isPlainObj(opts)) {
    throw new TypeError(`Options must be a plain object: ${opts}`)
  }

  const { soft = false } = opts

  if (typeof soft !== 'boolean') {
    throw new TypeError(`Option "soft" must be a boolean: ${soft}`)
  }

  return { soft }
}

const validateErrorOrObject = function (value, prefix) {
  if (value === undefined) {
    throw new TypeError(`${prefix} is required.`)
  }

  if (!isErrorOrObject(value)) {
    throw new TypeError(
      `${prefix} must be a plain object or an error: ${value}`,
    )
  }
}

const isErrorOrObject = function (value) {
  return isPlainObj(value) || isErrorInstance(value)
}
