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
   * setErrorProps(error, { prop: { one: false, two: true } }, { soft: true })
   * console.log(error.prop) // { one: true, two: true }
   * ```
   */
  readonly soft?: boolean
}

type DeepMergeObjects<
  One extends object,
  Two extends object,
  soft extends boolean,
> = {
  [oneKey in keyof One]: oneKey extends keyof Two
    ? DeepMerge<One[oneKey], Two[oneKey], soft>
    : One[oneKey]
} & {
  [twoKey in Exclude<keyof Two, keyof One>]: Two[twoKey]
}

type DeepMergeObjectsOrArrays<
  One extends object,
  Two extends object,
  soft extends boolean,
> = One extends any[]
  ? Two extends any[]
    ? [...One, ...Two]
    : DeepMergeObjects<One, Two, soft>
  : DeepMergeObjects<One, Two, soft>

type DeepMerge<One, Two, soft extends boolean> = Two extends object
  ? One extends object
    ? DeepMergeObjectsOrArrays<One, Two, soft>
    : Two
  : Two extends undefined
  ? soft extends true
    ? One
    : Two
  : Two

type DeepMergeWithPriority<
  Props,
  ErrorArg,
  soft extends boolean | undefined,
> = soft extends true
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
    DeepMergeWithPriority<
      Props,
      ErrorArg,
      OptionsArg['soft'] extends true ? true : false
    >,
    CoreErrorProps
  >
