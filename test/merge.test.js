import test from 'ava'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

const SIMPLE_VALUES = [
  null,
  '',
  true,
  0,
  0n,
  () => {},
  new Set([]),
  new Error('test'),
]

each([undefined, ...SIMPLE_VALUES], ({ title }, value) => {
  test(`Sets from a simple value | ${title}`, (t) => {
    t.is(setProps({ prop: true }, { prop: value }).prop, value)
  })

  test(`Sets to a simple value | ${title}`, (t) => {
    t.true(setProps({ prop: value }, { prop: true }).prop)
  })

  test(`Keeps to a simple value with "soft" | ${title}`, (t) => {
    t.true(setProps({ prop: true }, { prop: value }, { soft: true }).prop)
  })
})

each(SIMPLE_VALUES, ({ title }, value) => {
  test(`Keeps from a simple value with "soft" | ${title}`, (t) => {
    t.is(setProps({ prop: value }, { prop: true }, { soft: true }).prop, value)
  })
})

each([{}, { prop: undefined }], ({ title }, error) => {
  test(`Set simple values to undefined with "soft" | ${title}`, (t) => {
    t.true(setProps(error, { prop: true }, { soft: true }).prop)
  })
})

test('Does not merge arrays', (t) => {
  t.deepEqual(setProps({ prop: [0] }, { prop: [1] }).prop, [1])
})

test('Does not merge plain objects', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: 0 } },
      { prop: { two: true, three: false } },
    ).prop,
    { two: true, three: false },
  )
})
