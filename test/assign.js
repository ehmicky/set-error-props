import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { assertDescriptor } from './helpers/main.js'

each([true, false], ({ title }, enumerable) => {
  test(`Ignore non-configurable non-writable own properties | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const object = Object.defineProperty({}, 'prop', {
      value: false,
      enumerable,
      writable: false,
      configurable: false,
    })
    setErrorProps(object, { prop: true })
    assertDescriptor(t, object, 'prop', {
      value: false,
      enumerable,
      writable: false,
      configurable: false,
    })
  })
})

each([true, false], ({ title }, enumerable) => {
  test(`Can set non-configurable writable inherited properties | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const proto = Object.defineProperty(new Error('test'), 'prop', {
      value: false,
      enumerable,
      writable: true,
      configurable: false,
    })
    // eslint-disable-next-line fp/no-mutating-methods
    const object = Object.setPrototypeOf({}, proto)
    setErrorProps(object, { prop: true })
    assertDescriptor(t, object, 'prop', {
      value: true,
      enumerable,
      writable: true,
      configurable: false,
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

test('Cannot delete but can reset inherited properties', (t) => {
  // eslint-disable-next-line fp/no-mutating-assign
  const proto = Object.assign(new Error('test'), { prop: false })
  // eslint-disable-next-line fp/no-mutating-methods
  const object = Object.setPrototypeOf({}, proto)
  setErrorProps(object, { prop: undefined })
  assertDescriptor(t, object, 'prop', {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

const getFailProxy = function (proxyProp) {
  // eslint-disable-next-line fp/no-proxy
  return new Proxy(
    { prop: false },
    {
      [proxyProp]() {
        throw new Error('unsafe')
      },
    },
  )
}

test('Handles failed deletions', (t) => {
  const proxy = getFailProxy('deleteProperty')
  setErrorProps(proxy, { prop: undefined })
  assertDescriptor(t, proxy, 'prop', {
    value: undefined,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})

test('Handles failed assignments', (t) => {
  const proxy = getFailProxy('defineProperty')
  setErrorProps(proxy, { prop: true })
  assertDescriptor(t, proxy, 'prop', {
    value: false,
    enumerable: true,
    writable: true,
    configurable: true,
  })
})
