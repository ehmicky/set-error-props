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

test('Symbol properties can be set', (t) => {
  const symbol = Symbol('test')
  t.true(setProps({}, { [symbol]: true })[symbol])
})

test('Inherited properties are ignored', (t) => {
  t.false('prop' in setProps({}, { __proto__: { prop: true } }))
})

test('Non-enumerable properties are ignored', (t) => {
  // eslint-disable-next-line fp/no-mutating-methods
  const props = Object.defineProperty({}, 'prop', {
    value: true,
    enumerable: false,
  })
  t.false('prop' in setProps({}, props))
})
