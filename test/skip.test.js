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

test('Non-enumerable properties in second argument are ignored', (t) => {
  t.false('prop' in setProps({}, nonEnumerableProps))
})

// eslint-disable-next-line fp/no-class
class TestError extends Error {}
// eslint-disable-next-line fp/no-mutation
TestError.prototype.prop = true

test('Inherited properties in second argument are ignored', (t) => {
  t.false('prop' in setProps({}, new TestError('test')))
})

test('Cannot pollute prototypes', (t) => {
  const error = setProps(
    {},
    { name: 'test', toString: () => 'test', constructor: { name: 'test' } },
  )
  const proto = Object.getPrototypeOf(error)
  const values = [error, proto]
  values.forEach((value) => {
    t.not(value.toString(), 'test')
    t.not(value.name, 'test')
    t.not(value.constructor.name, 'test')
  })
})

test('Cannot override non-Error prototypes', (t) => {
  t.false(setErrorProps(new TestError('test'), { prop: false }).prop)
  t.true(TestError.prototype.prop)
})
