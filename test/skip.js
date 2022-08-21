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
