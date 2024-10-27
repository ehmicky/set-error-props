import test from 'ava'
import { each } from 'test-each'

import setErrorProps from 'set-error-props'

// eslint-disable-next-line max-params
const assertDescriptor = (t, object, propName, descriptor) => {
  t.deepEqual(Object.getOwnPropertyDescriptor(object, propName), descriptor)
}

test('Can delete defined properties', (t) => {
  t.false('prop' in setErrorProps({ prop: true }, { prop: undefined }))
})

each([{}, { prop: undefined }], [true, false], ({ title }, error, soft) => {
  test(`Can delete undefined properties | ${title}`, (t) => {
    t.false('prop' in setErrorProps(error, { prop: undefined }, { soft }))
  })
})

test('Cannot delete but can reset inherited properties', (t) => {
  // eslint-disable-next-line fp/no-mutating-assign
  const proto = Object.assign(new Error('test'), { prop: false })
  const object = Object.setPrototypeOf({}, proto)
  setErrorProps(object, { prop: undefined })
  assertDescriptor(t, object, 'prop', {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Handles failed deletions', (t) => {
  // eslint-disable-next-line fp/no-proxy
  const proxy = new Proxy(
    { prop: false },
    {
      deleteProperty: () => {
        throw new Error('unsafe')
      },
    },
  )
  setErrorProps(proxy, { prop: undefined })
  assertDescriptor(t, proxy, 'prop', {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Can set missing properties', (t) => {
  const object = {}
  setErrorProps(object, { prop: true })
  assertDescriptor(t, object, 'prop', {
    value: true,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Can set missing private properties', (t) => {
  const object = {}
  setErrorProps(object, { _prop: true })
  assertDescriptor(t, object, '_prop', {
    value: true,
    enumerable: false,
    writable: true,
    configurable: true,
  })
})

each(
  [
    [{}, {}, 'prop'],
    [{ enumerable: false }, { enumerable: false }, 'prop'],
    [{ writable: false }, { writable: false }, 'prop'],
    [{}, { enumerable: false }, '_prop'],
    [{ enumerable: false }, { enumerable: false }, '_prop'],
  ],
  // eslint-disable-next-line max-params
  ({ title }, oldDescriptor, newDescriptor, propName) => {
    test(`Can set properties with different descriptors | ${title}`, (t) => {
      const object = Object.defineProperty({}, propName, {
        value: false,
        enumerable: true,
        writable: true,
        configurable: true,
        ...oldDescriptor,
      })
      setErrorProps(object, { [propName]: true })
      assertDescriptor(t, object, propName, {
        value: true,
        enumerable: true,
        writable: true,
        configurable: true,
        ...newDescriptor,
      })
    })
  },
)
