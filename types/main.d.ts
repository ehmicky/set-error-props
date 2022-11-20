/**
 * `set-error-props` options
 */
export interface Options {
  /**
   * Whether `props` should have lower merging priority over `error` or not.
   *
   * @default false
   *
   * @example
   * ```js
   * const error = new Error('message')
   * error.one = true
   * setErrorProps(error, { one: false, two: true }, { soft: true })
   * console.log(error.one) // true
   * console.log(error.two) // true
   * ```
   */
  readonly soft?: boolean
}

type MergeObjects<
  Low extends object,
  High extends object,
  soft extends boolean,
> = {
  [oneKey in Exclude<keyof Low, keyof High>]: oneKey extends keyof High
    ? soft extends true
      ? Low[oneKey]
      : High[oneKey]
    : Low[oneKey]
} & {
  [twoKey in keyof High]: High[twoKey]
}

type CoreErrorProps =
  | 'name'
  | 'message'
  | 'stack'
  | 'cause'
  | 'error'
  | 'constructor'
  | 'toString'
  | 'hasOwnProperty'
  | 'isPrototypeOf'
  | 'propertyIsEnumerable'
  | 'valueOf'
  | 'toLocaleString'

/**
 * Assigns `props` to `error`.
 *
 * @example
 * ```js
 * const error = new Error('message')
 * error.prop = { one: [true] }
 * setErrorProps(error, { prop: { one: [false], two: true } })
 * console.log(error.prop) // { one: [true, false], two: true }
 * ```
 */
export default function setErrorProps<
  ErrorArg extends object,
  Props extends object,
  OptionsArg extends Options,
>(
  error: ErrorArg,
  props: Props,
  options?: OptionsArg,
): Pick<ErrorArg, CoreErrorProps & keyof ErrorArg> &
  Omit<
    OptionsArg['soft'] extends true
      ? MergeObjects<Props, ErrorArg, true>
      : MergeObjects<ErrorArg, Props, false>,
    CoreErrorProps
  >
