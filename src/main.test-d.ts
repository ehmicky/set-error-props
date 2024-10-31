import { expectAssignable, expectNotAssignable, expectType } from 'tsd'

import setErrorProps, { type Options } from 'set-error-props'

const error = new Error('test')
expectAssignable<Error>(setErrorProps(error, {}))

setErrorProps(error, error)
setErrorProps(error, {})
setErrorProps({}, error)
expectAssignable<{ a: 1 }>(setErrorProps({ a: 1 } as const, {}))
// @ts-expect-error
setErrorProps(undefined, error)

setErrorProps(error, {}, {})
expectAssignable<Options>({})
setErrorProps(error, {}, { soft: true })
expectAssignable<Options>({ soft: true })
// @ts-expect-error
setErrorProps(error, {}, { soft: 'true' })
expectNotAssignable<Options>({ soft: 'true' })

expectType<1>(setErrorProps({ a: 0 } as const, { a: 1 } as const).a)
expectType<0>(
  setErrorProps({ a: 0 } as const, { a: 1 } as const, { soft: true }).a,
)
expectType<1>(setErrorProps({ a: undefined } as const, { a: 1 } as const).a)
expectType<undefined>(
  setErrorProps({ a: undefined } as const, { a: 1 } as const, { soft: true }).a,
)
expectType<undefined>(
  setErrorProps({ a: undefined } as const, { a: undefined } as const).a,
)
expectType<undefined>(
  setErrorProps({ a: undefined } as const, { a: undefined } as const, {
    soft: true,
  }).a,
)
expectType<1>(setErrorProps({} as const, { a: 1 } as const).a)
expectType<1>(setErrorProps({} as const, { a: 1 } as const, { soft: true }).a)
expectType<undefined>(
  setErrorProps({ a: 1 } as const, { a: undefined } as const).a,
)
expectType<1>(
  setErrorProps({ a: 1 } as const, { a: undefined } as const, { soft: true }).a,
)
expectType<1>(setErrorProps({ a: 1 } as const, {} as const).a)
expectType<1>(setErrorProps({ a: 1 } as const, {} as const, { soft: true }).a)

const symbol = Symbol('test')
expectType<1>(
  setErrorProps({ [symbol]: 0 } as const, { [symbol]: 1 } as const)[symbol],
)
expectType<0>(
  setErrorProps({ [symbol]: 0 } as const, { [symbol]: 1 } as const, {
    soft: true,
  })[symbol],
)

expectType<'0'>(
  setErrorProps({ name: '0' } as const, { name: '1' } as const).name,
)
expectType<'0'>(
  setErrorProps({ name: '0' } as const, { name: '1' } as const, { soft: true })
    .name,
)
expectAssignable<() => '0'>(
  setErrorProps({} as Error & { toString: () => '0' }, { toString: () => '1' })
    .toString,
)
expectAssignable<() => '0'>(
  setErrorProps(
    {} as Error & { toString: () => '0' },
    { toString: () => '1' },
    { soft: true },
  ).toString,
)
