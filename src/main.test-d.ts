import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import setErrorProps, { Options } from './main.js'

const error = new Error('test')
expectAssignable<Error>(setErrorProps(error, {}))

setErrorProps(error, error)
setErrorProps(error, {})
expectError(setErrorProps({}, error))

setErrorProps(error, {}, {})
expectAssignable<Options>({})
setErrorProps(error, {}, { lowPriority: true })
expectAssignable<Options>({ lowPriority: true })
expectError(setErrorProps(error, {}, { lowPriority: 'true' }))
expectNotAssignable<Options>({ lowPriority: 'true' })

expectType<1>(setErrorProps({} as Error & { a: 0 }, { a: 1 as const }).a)
expectType<0>(
  setErrorProps(
    {} as Error & { a: 0 },
    { a: 1 as const },
    { lowPriority: true },
  ).a,
)
expectType<1>(setErrorProps({} as Error & { a: {} }, { a: 1 as const }).a)
expectType<{}>(
  setErrorProps(
    {} as Error & { a: {} },
    { a: 1 as const },
    { lowPriority: true },
  ).a,
)
expectType<{}>(setErrorProps({} as Error & { a: 0 }, { a: {} as const }).a)
expectType<0>(
  setErrorProps(
    {} as Error & { a: 0 },
    { a: {} as const },
    { lowPriority: true },
  ).a,
)
expectType<1>(
  setErrorProps({} as Error & { a: { b: 0 } }, { a: { b: 1 } as const }).a.b,
)
expectType<0>(
  setErrorProps(
    {} as Error & { a: { b: 0 } },
    { a: { b: 1 } as const },
    { lowPriority: true },
  ).a.b,
)
expectType<0>(
  setErrorProps({} as Error & { a: { b: 0 } }, { a: { c: 1 } as const }).a.b,
)
expectType<0>(
  setErrorProps(
    {} as Error & { a: { b: 0 } },
    { a: { c: 1 } as const },
    { lowPriority: true },
  ).a.b,
)
expectType<1>(
  setErrorProps({} as Error & { a: { c: 0 } }, { a: { b: 1 } as const }).a.b,
)
expectType<1>(
  setErrorProps(
    {} as Error & { a: { c: 0 } },
    { a: { b: 1 } as const },
    { lowPriority: true },
  ).a.b,
)
expectType<1>(setErrorProps({} as Error & { a: [0] }, { a: 1 as const }).a)
expectType<[0]>(
  setErrorProps(
    {} as Error & { a: [0] },
    { a: 1 as const },
    { lowPriority: true },
  ).a,
)
expectType<[1]>(setErrorProps({} as Error & { a: 0 }, { a: [1] as [1] }).a)
expectType<0>(
  setErrorProps(
    {} as Error & { a: 0 },
    { a: [1] as [1] },
    { lowPriority: true },
  ).a,
)
expectType<[0, 1]>(setErrorProps({} as Error & { a: [0] }, { a: [1] as [1] }).a)
expectType<[1, 0]>(
  setErrorProps(
    {} as Error & { a: [0] },
    { a: [1] as [1] },
    { lowPriority: true },
  ).a,
)
expectType<1>(
  setErrorProps({} as Error & { a: undefined }, { a: 1 as const }).a,
)
expectType<1>(
  setErrorProps(
    {} as Error & { a: undefined },
    { a: 1 as const },
    { lowPriority: true },
  ).a,
)
expectType<1>(setErrorProps({} as Error, { a: 1 as const }).a)
expectType<1>(
  setErrorProps({} as Error, { a: 1 as const }, { lowPriority: true }).a,
)
expectType<undefined>(setErrorProps({} as Error & { a: 1 }, { a: undefined }).a)
expectType<1>(
  setErrorProps({} as Error & { a: 1 }, { a: undefined }, { lowPriority: true })
    .a,
)
expectType<1>(setErrorProps({} as Error & { a: 1 }, {}).a)
expectType<1>(
  setErrorProps({} as Error & { a: 1 }, {}, { lowPriority: true }).a,
)
const symbol = Symbol('test')
expectType<1>(
  setErrorProps({} as Error & { [symbol]: 0 }, { [symbol]: 1 as const })[
    symbol
  ],
)
expectType<0>(
  setErrorProps(
    {} as Error & { [symbol]: 0 },
    { [symbol]: 1 as const },
    { lowPriority: true },
  )[symbol],
)
expectType<'0'>(
  setErrorProps({} as Error & { name: '0' }, { name: '1' as const }).name,
)
expectType<'0'>(
  setErrorProps(
    {} as Error & { name: '0' },
    { name: '1' as const },
    { lowPriority: true },
  ).name,
)
expectAssignable<() => '0'>(
  setErrorProps({} as Error & { toString: () => '0' }, { toString: () => '1' })
    .toString,
)
expectAssignable<() => '0'>(
  setErrorProps(
    {} as Error & { toString: () => '0' },
    { toString: () => '1' },
    { lowPriority: true },
  ).toString,
)
