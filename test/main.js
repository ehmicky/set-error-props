import { runInNewContext } from 'vm'

import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps, getError } from './helpers/main.js'

each([Error, runInNewContext('Error')], ({ title }, ErrorClass) => {
  test(`Returns the first argument as is | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.is(setErrorProps(error, {}), error)
  })
})

test('Allow the first argument to be a plain object', (t) => {
  t.true(setErrorProps({}, { prop: true }).prop)
})

test('Mutates the first argument', (t) => {
  const error = getError({})
  setErrorProps(error, { prop: true })
  t.true(error.prop)
})

test('Sets properties on top level errors', (t) => {
  t.deepEqual(
    {
      ...setProps(
        { one: true, three: true },
        // eslint-disable-next-line fp/no-mutating-assign
        Object.assign(new Error('test'), { two: true, three: false }),
      ),
    },
    { one: true, two: true, three: false },
  )
})

const symbol = Symbol('test')

test('Symbol properties can be set', (t) => {
  t.true(setProps({}, { [symbol]: true })[symbol])
})

// eslint-disable-next-line fp/no-class
class TestError extends Error {}
// eslint-disable-next-line fp/no-mutation
TestError.prototype.prop = true

test('Inherited properties are ignored', (t) => {
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
