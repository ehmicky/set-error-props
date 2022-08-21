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
   * error.prop = { one: true }
   * setErrorProps(error, { prop: { one: false, two: true } }, { lowPriority: true })
   * console.log(error.prop) // { one: true, two: true }
   * ```
   */
  readonly lowPriority?: boolean
}

type DeepMergeObjects<
  One extends object,
  Two extends object,
  LowPriority extends boolean,
> = {
  [oneKey in keyof One]: oneKey extends keyof Two
    ? DeepMerge<One[oneKey], Two[oneKey], LowPriority>
    : One[oneKey]
} & {
  [twoKey in Exclude<keyof Two, keyof One>]: Two[twoKey]
}

type DeepMergeObjectsOrArrays<
  One extends object,
  Two extends object,
  LowPriority extends boolean,
> = One extends any[]
  ? Two extends any[]
    ? [...One, ...Two]
    : DeepMergeObjects<One, Two, LowPriority>
  : DeepMergeObjects<One, Two, LowPriority>

type DeepMerge<One, Two, LowPriority extends boolean> = Two extends object
  ? One extends object
    ? DeepMergeObjectsOrArrays<One, Two, LowPriority>
    : Two
  : Two extends undefined
  ? LowPriority extends true
    ? One
    : Two
  : Two

type DeepMergeWithPriority<
  Props,
  ErrorArg,
  LowPriority extends boolean | undefined,
> = LowPriority extends true
  ? DeepMerge<Props, ErrorArg, true>
  : DeepMerge<ErrorArg, Props, false>

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
 * Assign `props` to `error`.
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
  ErrorArg extends Error,
  Props extends object,
  OptionsArg extends Options,
>(
  error: ErrorArg,
  props: Props,
  options?: OptionsArg,
): Error &
  Pick<ErrorArg, CoreErrorProps & keyof ErrorArg> &
  Omit<
    DeepMergeWithPriority<
      Props,
      ErrorArg,
      OptionsArg['lowPriority'] extends true ? true : false
    >,
    CoreErrorProps
  >
