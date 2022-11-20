/* eslint-disable max-lines */
import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

test('Can set missing properties', (t) => {
  const object = {}
  setErrorProps(object, { prop: true })
  t.deepEqual(Object.getOwnPropertyDescriptor(object, 'prop'), {
    value: true,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Can set missing private properties', (t) => {
  const object = {}
  setErrorProps(object, { _prop: true })
  t.deepEqual(Object.getOwnPropertyDescriptor(object, '_prop'), {
    value: true,
    enumerable: false,
    writable: true,
    configurable: true,
  })
})

each([true, false], [true, false], ({ title }, enumerable, writable) => {
  test(`Ignore non-configurable own properties | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const object = Object.defineProperty({}, 'prop', {
      value: false,
      enumerable,
      writable,
      configurable: false,
    })
    setErrorProps(object, { prop: true })
    t.deepEqual(Object.getOwnPropertyDescriptor(object, 'prop'), {
      value: false,
      enumerable,
      writable,
      configurable: false,
    })
  })

  test(`Can set non-configurable inherited properties | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const proto = Object.defineProperty(new Error('test'), 'prop', {
      value: false,
      enumerable,
      writable,
      configurable: false,
    })
    // eslint-disable-next-line fp/no-mutating-methods
    const object = Object.setPrototypeOf({}, proto)
    setErrorProps(object, { prop: true })
    t.deepEqual(Object.getOwnPropertyDescriptor(object, 'prop'), {
      value: true,
      enumerable,
      writable,
      configurable: true,
    })
  })
})

test('Can delete defined properties', (t) => {
  t.false('prop' in setErrorProps({ prop: true }, { prop: undefined }))
})

each([{}, { prop: undefined }], [true, false], ({ title }, error, soft) => {
  test(`Can delete undefined properties | ${title}`, (t) => {
    t.false('prop' in setErrorProps(error, { prop: undefined }, { soft }))
  })
})

test('Handles failed deletions', (t) => {
  // eslint-disable-next-line fp/no-proxy
  const proxy = new Proxy(
    { prop: false },
    {
      deleteProperty() {
        throw new Error('unsafe')
      },
    },
  )
  setErrorProps(proxy, { prop: undefined })
  t.deepEqual(Object.getOwnPropertyDescriptor(proxy, 'prop'), {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Handles failed assignments', (t) => {
  // eslint-disable-next-line fp/no-proxy
  const proxy = new Proxy(
    { prop: false },
    {
      set() {
        throw new Error('unsafe')
      },
    },
  )
  setErrorProps(proxy, { prop: true })
  t.deepEqual(Object.getOwnPropertyDescriptor(proxy, 'prop'), {
    value: false,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Cannot delete but can reset inherited properties', (t) => {
  // eslint-disable-next-line fp/no-mutating-assign
  const proto = Object.assign(new Error('test'), { prop: false })
  // eslint-disable-next-line fp/no-mutating-methods
  const object = Object.setPrototypeOf({}, proto)
  setErrorProps(object, { prop: undefined })
  t.deepEqual(Object.getOwnPropertyDescriptor(object, 'prop'), {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

each(
  [
    [{}, {}, 'prop'],
    [{ enumerable: false }, { enumerable: false }, 'prop'],
    [{ writable: false }, { writable: false }, 'prop'],
    [
      { enumerable: false, writable: false },
      { enumerable: false, writable: false },
      'prop',
    ],
    [{}, { enumerable: false }, '_prop'],
    [{ enumerable: false }, { enumerable: false }, '_prop'],
    [{ writable: false }, { enumerable: false, writable: false }, '_prop'],
    [
      { enumerable: false, writable: false },
      { enumerable: false, writable: false },
      '_prop',
    ],
  ],
  // eslint-disable-next-line max-params
  ({ title }, oldDescriptor, newDescriptor, propName) => {
    test(`Can set properties with different descriptors | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutating-methods
      const object = Object.defineProperty({}, propName, {
        value: false,
        enumerable: true,
        writable: true,
        configurable: true,
        ...oldDescriptor,
      })
      setErrorProps(object, { [propName]: true })
      t.deepEqual(Object.getOwnPropertyDescriptor(object, propName), {
        value: true,
        enumerable: true,
        writable: true,
        configurable: true,
        ...newDescriptor,
      })
    })
  },
)

each(
  [
    { propName: 'prop', enumerable: true },
    { propName: '_prop', enumerable: false },
  ],
  ({ title }, { propName, enumerable }) => {
    test(`Keeps get/set | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-let
      let state = false
      const get = () => state

      const set = (newState) => {
        // eslint-disable-next-line fp/no-mutation
        state = newState
      }

      const descriptor = { get, set, enumerable: true, configurable: true }
      // eslint-disable-next-line fp/no-mutating-methods
      const object = Object.defineProperty({}, propName, descriptor)
      setErrorProps(object, { [propName]: true })
      t.true(object[propName])
      t.deepEqual(Object.getOwnPropertyDescriptor(object, propName), {
        ...descriptor,
        enumerable,
      })
    })
  },
)
