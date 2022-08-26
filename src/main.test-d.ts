import { expectType, expectAssignable } from 'tsd'

import setErrorProps, { Options } from './main.js'

expectType<object>(setErrorProps(true))

setErrorProps(true, {})
expectAssignable<Options>({})
