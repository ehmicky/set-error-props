/**
 * `set-error-props` options
 */
export interface Options {
  /**
   * Whether `props` should have higher merging priority over `error` or not.
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
export default function setErrorProps(
  error: Error,
  props: Error | {},
  options?: Options,
): void
