import { runInNewContext } from 'vm'

import test from 'ava'
import { each } from 'test-each'

import { setProps, setDirectProps } from './helpers/main.js'

// eslint-disable-next-line unicorn/no-null
each([undefined, null, ''], ({ title }, invalidValue) => {
  test(`Is a noop if the first argument is invalid | ${title}`, (t) => {
    t.notThrows(setProps.bind(undefined, invalidValue, {}))
  })

  test(`Is a noop if the second argument is invalid | ${title}`, (t) => {
    t.not(setProps({}, invalidValue), invalidValue)
  })
})

test('Is a noop if the first argument is not an error', (t) => {
  t.true(setDirectProps({ prop: true }, { prop: false }).prop)
})

each([Error, runInNewContext('Error')], ({ title }, ErrorClass) => {
  test(`Is not a noop if the first argument is an error | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutating-assign
    const error = Object.assign(new ErrorClass('test'), { prop: true })
    t.false(setDirectProps(error, { prop: false }).prop)
  })
})

const symbol = Symbol('test')

test('Symbol properties can be set', (t) => {
  t.true(setProps({}, { [symbol]: true })[symbol])
})

test('Symbol properties can be set deeply', (t) => {
  t.true(setProps({}, { deep: { [symbol]: true } }).deep[symbol])
})

const inheritedProps = { __proto__: { one: true } }

test('Inherited properties are ignored at the top level', (t) => {
  t.false('one' in setProps({}, inheritedProps))
})

test('Inherited properties are considered not plain objects deeply', (t) => {
  const { deep } = setProps({ deep: { two: true } }, { deep: inheritedProps })
  t.true(deep.one)
  t.false('two' in deep)
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
  // eslint-disable-next-line fp/no-class
  class TestError extends Error {}
  // eslint-disable-next-line fp/no-mutation
  TestError.prototype.prop = 'proto'
  t.is(setDirectProps(new TestError('test'), { prop: 'test' }).prop, 'test')
  t.is(TestError.prototype.prop, 'proto')
})
