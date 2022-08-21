import { runInNewContext } from 'vm'

import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps, getError } from './helpers/main.js'

// eslint-disable-next-line unicorn/no-null
each([undefined, null, '', {}], ({ title }, notError) => {
  test(`Normalizes the first argument if not an error | ${title}`, (t) => {
    t.true(setErrorProps(notError, {}) instanceof Error)
  })
})

each([Error, runInNewContext('Error')], ({ title }, ErrorClass) => {
  test(`Returns the first argument as is if is a valid error | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.is(setErrorProps(error, {}), error)
  })
})

test('Mutates the first argument', (t) => {
  const error = getError({})
  setErrorProps(error, { prop: true })
  t.true(error.prop)
})

const symbol = Symbol('test')

test('Symbol properties can be set', (t) => {
  t.true(setProps({}, { [symbol]: true })[symbol])
})

test('Symbol properties can be set deeply', (t) => {
  t.true(setProps({}, { deep: { [symbol]: true } }).deep[symbol])
})

// eslint-disable-next-line fp/no-class
class TestError extends Error {}
// eslint-disable-next-line fp/no-mutation
TestError.prototype.prop = true

test('Inherited properties are ignored at the top level', (t) => {
  t.false('prop' in setProps({}, new TestError('test')))
})

test('Inherited properties are considered not plain objects deeply', (t) => {
  const { deep } = setProps(
    { deep: { one: true } },
    { deep: new TestError('test') },
  )
  t.true(deep.prop)
  t.false('one' in deep)
})

test('Cannot pollute prototypes at the top level', (t) => {
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

test('Cannot pollute prototypes deeply', (t) => {
  const {
    prop: { deep, __proto__ },
  } = setProps(
    { prop: { __proto__: { deep: { one: true } } } },
    { prop: { deep: { two: true } } },
  )
  t.deepEqual(deep, { two: true })
  t.is(__proto__.deep, undefined)
})

test('Cannot override non-Error prototypes at the top level', (t) => {
  t.false(setErrorProps(new TestError('test'), { prop: false }).prop)
  t.true(TestError.prototype.prop)
})
