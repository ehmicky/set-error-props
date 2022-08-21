import test from 'ava'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

// eslint-disable-next-line unicorn/no-null
const NOT_PLAIN_OBJECTS = [null, '', new Set([])]
each([...NOT_PLAIN_OBJECTS, undefined], ({ title }, invalidValue) => {
  test(`Throws if the second argument is invalid | ${title}`, (t) => {
    t.throws(setProps.bind(undefined, {}, invalidValue))
  })
})

each(NOT_PLAIN_OBJECTS, ({ title }, invalidValue) => {
  test(`Throws if the options are invalid | ${title}`, (t) => {
    t.throws(setProps.bind(undefined, {}, {}, invalidValue))
  })
})

test('Throws if the "lowPriority" is invalid', (t) => {
  t.throws(setProps.bind(undefined, {}, {}, { lowPriority: 'true' }))
})
