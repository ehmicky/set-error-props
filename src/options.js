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

  const { lowPriority = false } = opts

  if (typeof lowPriority !== 'boolean') {
    throw new TypeError(
      `Option "lowPriority" must be a boolean: ${lowPriority}`,
    )
  }

  return { lowPriority }
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
  return isPlainObj(value) || isError(value)
}

const isError = function (props) {
  return objectToString.call(props) === '[object Error]'
}

const { toString: objectToString } = Object.prototype
