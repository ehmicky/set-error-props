import test from 'ava'
import setErrorProps from 'set-error-props'
import { each } from 'test-each'

import { setProps } from './helpers/main.js'

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

each([{}, { prop: undefined }], [true, false], ({ title }, error, soft) => {
  test(`undefined values are deleted | ${title}`, (t) => {
    t.false('prop' in setProps(error, { prop: undefined }, { soft }))
  })
})
