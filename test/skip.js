import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps, getFullError } from './helpers/main.js'

each(
  [
    { propName: 'name', value: 'TestError' },
    { propName: 'message', value: 'test' },
    { propName: 'stack', value: 'test' },
    { propName: 'cause', value: new Error('cause') },
    { propName: 'errors', value: [new Error('test')] },
  ],
  ({ title }, { propName, value }) => {
    test(`Does not set core properties at the top level | ${title}`, (t) => {
      const error = getFullError()
      const oldValue = error[propName]
      t.deepEqual(
        setErrorProps(error, { [propName]: value })[propName],
        oldValue,
      )
    })

    test(`Sets core properties deeply | ${title}`, (t) => {
      const error = getFullError()
      t.is(
        setErrorProps(error, { deep: { [propName]: value } }).deep[propName],
        value,
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
  const error = new Error('test')
  // eslint-disable-next-line fp/no-mutating-methods
  const nonWritableObject = Object.defineProperty(error, 'prop', {
    value: true,
    enumerable: true,
    writable: false,
    configurable: true,
  })
  t.true(setErrorProps(nonWritableObject, { prop: false }).prop)
})

const getProxyObject = function () {
  const error = new Error('test')
  error.changed = false
  // eslint-disable-next-line fp/no-mutating-methods
  return Object.defineProperty(error, 'prop', {
    get() {
      return 'prop'
    },
    set(value) {
      // eslint-disable-next-line fp/no-mutation, fp/no-this
      this.changed = value
    },
  })
}

test('Sets value is different', (t) => {
  t.true(setErrorProps(getProxyObject(), { prop: true }).changed)
})

test('Does not set value is identical', (t) => {
  t.false(setErrorProps(getProxyObject(), { prop: 'prop' }).changed)
})

test('Sets undefined if high priority', (t) => {
  t.true('prop' in setProps({}, { prop: undefined }))
})

test('Does not set undefined if low priority', (t) => {
  t.false('prop' in setProps({}, { prop: undefined }, { lowPriority: true }))
})
