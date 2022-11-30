import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps } from './helpers/main.test.js'

const NOT_PLAIN_OBJECTS = [null, '', new Set([]), () => {}]
each([...NOT_PLAIN_OBJECTS, undefined], ({ title }, invalidValue) => {
  test(`Throws if the first argument is invalid | ${title}`, (t) => {
    t.throws(setErrorProps.bind(undefined, invalidValue, {}))
  })

  test(`Throws if the second argument is invalid | ${title}`, (t) => {
    t.throws(setProps.bind(undefined, {}, invalidValue))
  })
})

each(NOT_PLAIN_OBJECTS, ({ title }, invalidValue) => {
  test(`Throws if the options are invalid | ${title}`, (t) => {
    t.throws(setProps.bind(undefined, {}, {}, invalidValue))
  })
})

test('Throws if the "soft" is invalid', (t) => {
  t.throws(setProps.bind(undefined, {}, {}, { soft: 'true' }))
})
