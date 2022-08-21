import test from 'ava'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

const hasProp = function (prop, propName) {
  return typeof prop === 'object' && prop !== null && propName in prop
}

each(
  // eslint-disable-next-line unicorn/no-null, no-magic-numbers
  [undefined, null, '', true, 0, 0n, () => {}, new Set([]), new Error('test')],
  ({ title }, value) => {
    test(`Sets if setting a simple value | ${title}`, (t) => {
      const { prop } = setProps({ prop: { one: true } }, { prop: value })
      t.is(prop, value)
      t.false(hasProp(prop, 'one'))
    })

    test(`Keeps if merging to a simple value in low priority | ${title}`, (t) => {
      const { prop } = setProps(
        { prop: value },
        { prop: { one: true } },
        { lowPriority: true },
      )
      t.is(prop, value)
      t.false(hasProp(prop, 'one'))
    })

    test(`Set if merging to a simple value | ${title}`, (t) => {
      t.true(setProps({ prop: value }, { prop: { one: true } }).prop.one)
    })

    test(`Keeps if setting a simple value in low priority | ${title}`, (t) => {
      t.true(
        setProps(
          { prop: { one: true } },
          { prop: value },
          { lowPriority: true },
        ).prop.one,
      )
    })
  },
)

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

test('Concatenate arrays', (t) => {
  t.deepEqual(setProps({ prop: [0] }, { prop: [1] }).prop, [0, 1])
})

test('Concatenate arrays in reverse in low priority', (t) => {
  t.deepEqual(
    setProps({ prop: [0] }, { prop: [1] }, { lowPriority: true }).prop,
    [1, 0],
  )
})

test('Merges plain objects', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: true } },
      { prop: { two: true, three: false } },
    ).prop,
    { one: true, two: true, three: false },
  )
})

test('Merges plain objects in low priority', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: true } },
      { prop: { two: true, three: false } },
      { lowPriority: true },
    ).prop,
    { one: true, two: true, three: true },
  )
})

test('Sets non-plain objects deeply', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: true } },
      { prop: { two: true, three: false, __proto__: {} } },
    ).prop,
    { two: true, three: false },
  )
})

test('Merges non-plain objects at the top level', (t) => {
  t.deepEqual(
    setProps(
      { one: true, three: true },
      { two: true, three: false, __proto__: {} },
    ),
    { one: true, two: true, three: false },
  )
})

test('Merges errors at the top level', (t) => {
  t.deepEqual(
    {
      ...setProps(
        Object.assign(new Error('test'), { one: true, three: true }),
        Object.assign(new Error('test'), { two: true, three: false }),
      ),
    },
    { one: true, two: true, three: false },
  )
})
