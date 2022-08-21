import test from 'ava'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

// eslint-disable-next-line unicorn/no-null
each([undefined, null, ''], ({ title }, invalidValue) => {
  test(`Is a noop if the first argument is invalid | ${title}`, (t) => {
    t.notThrows(setProps.bind(undefined, invalidValue, {}))
  })

  test(`Is a noop if the second argument is invalid | ${title}`, (t) => {
    t.deepEqual(setProps({}, invalidValue), {})
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
  const { deep, __proto__ } = setProps(
    { __proto__: { deep: { one: true } } },
    { deep: { two: true } },
  )
  t.deepEqual(deep, { one: true, two: true })
  t.deepEqual(__proto__.deep, { one: true })
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
