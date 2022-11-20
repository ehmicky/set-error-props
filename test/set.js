import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { assertDescriptor } from './helpers/main.js'

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
