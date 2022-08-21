/**
 * `set-error-props` options
 */
export interface Options {
  /**
   *
   */
  readonly shallow?: boolean
}

/**
 *
 * @example
 * ```js
 * ```
 */
export default function setErrorProps(
  error: Error,
  props: Error | {},
  options?: Options,
): void
