import isPlainObj from 'is-plain-obj'

// Normalize and validate `props` and `options`.
// Invalid `error` are normalized but do not throw since they might be outside
// of the user's control, unlike `props` and `options`.
export const normalizeOptions = function (props, opts = {}) {
  validateProps(props)

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

const validateProps = function (props) {
  if (props === undefined) {
    throw new TypeError('Second argument is required')
  }

  if (!isPlainObj(props) && !isError(props)) {
    throw new TypeError(
      `Second argument must be a plain object or an error: ${props}`,
    )
  }
}

const isError = function (props) {
  return objectToString.call(props) === '[object Error]'
}

const { toString: objectToString } = Object.prototype
