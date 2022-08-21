import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import setErrorProps, { Options } from './main.js'

expectType<void>(setErrorProps({}, {}))

const error = new Error('test')
setErrorProps(error, error)
setErrorProps(error, {})
setErrorProps({}, error)

setErrorProps({}, {}, {})
expectAssignable<Options>({})
setErrorProps({}, {}, { shallow: true })
expectAssignable<Options>({ shallow: true })
expectError(setErrorProps({}, {}, { shallow: 'true' }))
expectNotAssignable<Options>({ shallow: 'true' })
