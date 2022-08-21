import test from 'ava'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

each(
  ['name', 'message', 'stack', 'cause', 'errors'],
  ({ title }, corePropName) => {
    test(`Does not set core properties at the top level | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutating-assign
      const error = Object.assign(new Error('test'), {
        cause: true,
        errors: [],
      })
      const value = error[corePropName]
      t.is(setProps(error, { [corePropName]: false })[corePropName], value)
    })

    test(`Sets core properties deeply | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutating-assign
      const error = Object.assign(new Error('test'), {
        cause: true,
        errors: [],
      })
      t.true(
        setProps(error, { deep: { [corePropName]: true } }).deep[corePropName],
      )
    })
  },
)

// eslint-disable-next-line fp/no-mutating-methods
const nonEnumerableProps = Object.defineProperty({}, 'prop', {
  value: true,
  enumerable: false,
})

test('Non-enumerable properties are ignored at the top level', (t) => {
  t.false('prop' in setProps({}, nonEnumerableProps))
})

test('Non-enumerable properties are ignored deeply when merged', (t) => {
  t.false('prop' in setProps({ deep: {} }, { deep: nonEnumerableProps }).deep)
})

test('Non-enumerable properties are included deeply when not merged', (t) => {
  t.true('prop' in setProps({}, { deep: nonEnumerableProps }).deep)
})

test('Handle non-writable properties', (t) => {
  // eslint-disable-next-line fp/no-mutating-methods
  const nonWritableObject = Object.defineProperty({}, 'prop', {
    value: true,
    enumerable: true,
    writable: false,
    configurable: true,
  })
  t.true(setProps(nonWritableObject, { prop: false }).prop)
})

const getProxyObject = function () {
  return {
    changed: false,
    // eslint-disable-next-line fp/no-get-set
    get prop() {
      return 'prop'
    },
    // eslint-disable-next-line fp/no-get-set
    set prop(value) {
      // eslint-disable-next-line fp/no-mutation, fp/no-this
      this.changed = value
    },
  }
}

test('Sets value is different', (t) => {
  t.true(setProps(getProxyObject(), { prop: true }).changed)
})

test('Does not set value is identical', (t) => {
  t.false(setProps(getProxyObject(), { prop: 'prop' }).changed)
})

test('Sets undefined if high priority', (t) => {
  t.true('prop' in setProps({}, { prop: undefined }))
})

test('Does not set undefined if low priority', (t) => {
  t.false('prop' in setProps({}, { prop: undefined }, { lowPriority: true }))
})
