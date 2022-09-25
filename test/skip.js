import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

each(
  [
    'name',
    'message',
    'stack',
    'errors',
    'prototype',
    'constructor',
    '__proto__',
    'toString',
    'toLocaleString',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'valueOf',
  ],
  ({ title }, propName) => {
    test(`Ignore some properties | ${title}`, (t) => {
      t.not(setErrorProps({}, { [propName]: true })[propName], true)
    })
  },
)
// eslint-disable-next-line fp/no-mutating-methods
const nonEnumerableProps = Object.defineProperty({}, 'prop', {
  value: true,
  enumerable: false,
})

test('Non-enumerable properties are ignored', (t) => {
  t.false('prop' in setProps({}, nonEnumerableProps))
})

test('Handle non-writable properties', (t) => {
  const error = new Error('test')
  // eslint-disable-next-line fp/no-mutating-methods
  const nonWritableObject = Object.defineProperty(error, 'prop', {
    value: true,
    enumerable: true,
    writable: false,
    configurable: true,
  })
  t.true(setErrorProps(nonWritableObject, { prop: false }).prop)
})

const getProxyObject = function () {
  const error = new Error('test')
  error.changed = false
  // eslint-disable-next-line fp/no-mutating-methods
  return Object.defineProperty(error, 'prop', {
    get() {
      return 'prop'
    },
    set(value) {
      // eslint-disable-next-line fp/no-mutation, fp/no-this
      this.changed = value
    },
  })
}

test('Sets value is different', (t) => {
  t.true(setErrorProps(getProxyObject(), { prop: true }).changed)
})

test('Does not set value is identical', (t) => {
  t.false(setErrorProps(getProxyObject(), { prop: 'prop' }).changed)
})

each([true, false], ({ title }, soft) => {
  test(`undefined values are deleted not set | ${title}`, (t) => {
    t.false('prop' in setProps({}, { prop: undefined }, { soft }))
  })
})

test('Delete undefined if high priority', (t) => {
  t.false('prop' in setProps({ prop: undefined }, { prop: undefined }))
})

test('Does not delete undefined if low priority', (t) => {
  t.true(
    'prop' in
      setProps({ prop: undefined }, { prop: undefined }, { soft: true }),
  )
})
