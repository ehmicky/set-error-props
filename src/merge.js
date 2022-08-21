import deepMerge from 'deepmerge'
import isPlainObj from 'is-plain-obj'

// Merge `error[propName]` and `props[propName]`
export const mergeValues = function (errorValue, propsValue, lowPriority) {
  return shouldMergeValues(errorValue, propsValue)
    ? mergeDeepValue(errorValue, propsValue, lowPriority)
    : mergeFlatValue(errorValue, propsValue, lowPriority)
}

const shouldMergeValues = function (errorValue, propsValue) {
  return isArrayOrObject(errorValue) && isArrayOrObject(propsValue)
}

const isArrayOrObject = function (value) {
  return isPlainObj(value) || Array.isArray(value)
}

const mergeDeepValue = function (errorValue, propsValue, lowPriority) {
  return lowPriority
    ? deepMerge(propsValue, errorValue, DEEP_MERGE_OPTS)
    : deepMerge(errorValue, propsValue, DEEP_MERGE_OPTS)
}

const isMergeableObject = function (value) {
  return isPlainObj(value) || Array.isArray(value)
}

const DEEP_MERGE_OPTS = { isMergeableObject }

const mergeFlatValue = function (errorValue, propsValue, lowPriority) {
  return lowPriority && errorValue !== undefined ? errorValue : propsValue
}
