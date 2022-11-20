import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps, getError } from './helpers/main.js'

each([new Error('test'), {}], ({ title }, error) => {
  test(`Returns the first argument as is | ${title}`, (t) => {
    t.is(setErrorProps(error, {}), error)
  })
})

test('Mutates the first argument', (t) => {
  const error = getError({})
  setErrorProps(error, { prop: true })
  t.true(error.prop)
})

test('Sets properties on top level errors', (t) => {
  t.deepEqual(
    { ...setProps({ one: true, three: true }, { two: true, three: false }) },
    { one: true, two: true, three: false },
  )
})

const symbol = Symbol('test')

test('Symbol properties can be set', (t) => {
  t.true(setProps({}, { [symbol]: true })[symbol])
})
