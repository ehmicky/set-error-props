import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import setErrorProps, { Options } from './main.js'

const error = new Error('test')
expectType<void>(setErrorProps(error, {}))

setErrorProps(error, error)
setErrorProps(error, {})
expectError(setErrorProps({}, error))

setErrorProps(error, {}, {})
expectAssignable<Options>({})
setErrorProps(error, {}, { shallow: true })
expectAssignable<Options>({ shallow: true })
expectError(setErrorProps(error, {}, { shallow: 'true' }))
expectNotAssignable<Options>({ shallow: 'true' })
