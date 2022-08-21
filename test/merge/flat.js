import test from 'ava'
import { each } from 'test-each'

import { setProps } from '../helpers/main.js'

const hasProp = function (prop, propName) {
  return typeof prop === 'object' && prop !== null && propName in prop
}

const SIMPLE_VALUES = [
  // eslint-disable-next-line unicorn/no-null
  null,
  '',
  true,
  0,
  // eslint-disable-next-line no-magic-numbers
  0n,
  () => {},
  new Set([]),
  new Error('test'),
]

each([undefined, ...SIMPLE_VALUES], ({ title }, value) => {
  test(`Sets if setting a simple value | ${title}`, (t) => {
    const { prop } = setProps({ prop: { one: true } }, { prop: value })
    t.is(prop, value)
    t.false(hasProp(prop, 'one'))
  })

  test(`Set if merging to a simple value | ${title}`, (t) => {
    t.true(setProps({ prop: value }, { prop: { one: true } }).prop.one)
  })

  test(`Keeps if setting a simple value in low priority | ${title}`, (t) => {
    t.true(
      setProps({ prop: { one: true } }, { prop: value }, { lowPriority: true })
        .prop.one,
    )
  })
})

each(SIMPLE_VALUES, ({ title }, value) => {
  test(`Keeps if merging to a simple value in low priority | ${title}`, (t) => {
    const { prop } = setProps(
      { prop: value },
      { prop: { one: true } },
      { lowPriority: true },
    )
    t.is(prop, value)
    t.false(hasProp(prop, 'one'))
  })
})

each([{}, { prop: undefined }], ({ title }, error) => {
  test(`Merges if merging to a simple value in low priority to undefined | ${title}`, (t) => {
    t.true(
      setProps(error, { prop: { one: true } }, { lowPriority: true }).prop.one,
    )
  })
})

test('Sets arrays when merged to objects', (t) => {
  const { prop } = setProps({ prop: { one: true } }, { prop: [true] })
  t.true(prop[0])
  t.false(hasProp(prop, 'one'))
})

test('Keeps if setting objects when merged to arrays in low priority', (t) => {
  const { prop } = setProps(
    { prop: [true] },
    { prop: { one: true } },
    { lowPriority: true },
  )
  t.true(prop[0])
  t.false(hasProp(prop, 'one'))
})

test('Sets objects when merged to arrays', (t) => {
  t.true(setProps({ prop: [] }, { prop: { one: true } }).prop.one)
})

test('Keeps if setting arrays when merged to objects in low priority', (t) => {
  t.true(
    setProps({ prop: { one: true } }, { prop: [true] }, { lowPriority: true })
      .prop.one,
  )
})
