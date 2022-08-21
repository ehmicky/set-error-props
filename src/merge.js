import deepMerge from 'deepmerge'
import isPlainObj from 'is-plain-obj'

// Merge `error[propName]` and `props[propName]`
export const mergeValues = function (errorValue, propsValue, lowPriority) {
  if (!shouldMergeValues(errorValue, propsValue)) {
    return lowPriority ? errorValue : propsValue
  }

  return lowPriority
    ? deepMerge(propsValue, errorValue, DEEP_MERGE_OPTS)
    : deepMerge(errorValue, propsValue, DEEP_MERGE_OPTS)
}

const shouldMergeValues = function (errorValue, propsValue) {
  return isArrayOrObject(errorValue) && isArrayOrObject(propsValue)
}

const isArrayOrObject = function (value) {
  return isPlainObj(value) || Array.isArray(value)
}

const isMergeableObject = function (value) {
  return isPlainObj(value) || Array.isArray(value)
}

const DEEP_MERGE_OPTS = { isMergeableObject }
