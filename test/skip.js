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

each([{}, { prop: undefined }], [true, false], ({ title }, error, soft) => {
  test(`undefined values are deleted | ${title}`, (t) => {
    t.false('prop' in setProps(error, { prop: undefined }, { soft }))
  })
})
