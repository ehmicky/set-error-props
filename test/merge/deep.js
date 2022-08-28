import test from 'ava'

import { setProps } from '../helpers/main.js'

test('Concatenate arrays', (t) => {
  t.deepEqual(setProps({ prop: [0] }, { prop: [1] }).prop, [0, 1])
})

test('Concatenate arrays in reverse in low priority', (t) => {
  t.deepEqual(
    setProps({ prop: [0] }, { prop: [1] }, { soft: true }).prop,
    [1, 0],
  )
})

test('Concatenate arrays deeply', (t) => {
  t.deepEqual(
    setProps({ deep: { prop: [0] } }, { deep: { prop: [1] } }).deep.prop,
    [0, 1],
  )
})

test('Merges plain objects', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: 0 } },
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
      { soft: true },
    ).prop,
    { one: true, two: true, three: true },
  )
})

test('Sets non-plain objects deeply', (t) => {
  t.deepEqual(
    setProps(
      { prop: { one: true, three: '' } },
      { prop: { two: true, three: false, __proto__: {} } },
    ).prop,
    { two: true, three: false },
  )
})

test('Merges errors at the top level', (t) => {
  t.deepEqual(
    {
      ...setProps(
        { one: true, three: true },
        // eslint-disable-next-line fp/no-mutating-assign
        Object.assign(new Error('test'), { two: true, three: false }),
      ),
    },
    { one: true, two: true, three: false },
  )
})
