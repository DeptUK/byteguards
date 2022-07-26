/*
@deprecated
This whole file is deprecated, but it's still useful if you need something really simple and fast at boundaries.
*/

/**
 * Represents a type guard from `unknown` to `A`,
 */
export type Is<A> = (a: unknown) => a is A

/** Use this when you need a type guard but don't care about the result. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isUnknown: Is<unknown> = (u: unknown): u is unknown => (u ? true : true)

export const isBoolean: Is<boolean> = (u: unknown): u is boolean => typeof u === 'boolean'

export const isString: Is<string> = (u: unknown): u is string => typeof u === 'string'

export const isNumber: Is<number> = (u: unknown): u is number => typeof u === 'number'

export const isObject: Is<object> = (u: unknown): u is object => typeof u === 'object'

export const isNull: Is<null> = (u: unknown): u is null => u === null

export const isUndefined: Is<undefined> = (u: unknown): u is undefined => u === undefined

export const isLiteral = <A>(...as: A[]): Is<A> => (u: unknown): u is A => {
  for (const a of as) {
    if (a === u) return true
  }
  return false
}

/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
export const isNullable = <A>(isa: Is<A>) => (u: unknown): u is A | null => isNull(u) || isa(u)

/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
export const isOptional = <A>(isa: Is<A>) => (u: unknown): u is A | undefined => isUndefined(u) || isa(u)

/**
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
export const isRequired = <A>(isa: Is<A | undefined>) => (u: unknown): u is A => !isUndefined(u) && isa(u)

/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
export const isArray = <A>(isa: Is<A>) => (u: unknown): u is A[] => Array.isArray(u) && u.every(isa)

/**
 * Helper to create a type guard for an object structure `O`.
 *
 * **Danger:** this won't be able to warn you if you forget to check for optional fields,
 * or if you specify additional non-existent fields, so don't do either of those things.
 *
 * @param isas a struct describing the type guards for the fields of `O`
 * @example
 * type Foo = {
 *   s: string
 *   n: number
 * }
 * const isFoo: Is<Foo> = isStruct({
 *   s: isString,
 *   n: isNumber,
 * })
 */
export const isStruct = <O extends { [key: string]: unknown }>(isas: { [K in keyof O]: Is<O[K]> }): Is<O> => (
  o
): o is O => {
  if (o === null || typeof o !== 'object') return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = o as any
  for (const k of Object.getOwnPropertyNames(isas)) {
    if (!isas[k](a[k])){
      return false
    }
  }
  return true
}

/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
export const isRecord = <K extends PropertyKey, V>(isK: Is<K>, isV: Is<V>): Is<Record<K, V>> => (
  r
): r is Record<K, V> => {
  if (r === null || typeof r !== 'object') return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = r as any
  for (const k in a) {
    if (!isK(k) || !isV(a[k])) return false
  }
  return true
}

type UnionTupleElements<T extends Is<unknown>[]> = T extends Array<Is<infer U>> ? U : never
/**
 * Helper to create a type guard for a union with up to 5 options.
 *
 * @example
 * type Foo = string | number
 * const isFoo: Is<Foo> = isUnion(isString, isNumber)
 * @example
 * type Bar = string | number | null
 * const isBar: Is<Bar> = isUnion(isString, isNumber, isNull)
 */

export function isUnion<T extends Is<unknown>[]>(
  ...allTypeGuards: T) {
  return (u: unknown): u is UnionTupleElements<T> => allTypeGuards.some((isT) => isT(u))
}

type IntersectTupleElements<T extends any[]> = { [I in keyof T]: (x: T[I]) => void }[number] extends (x: infer I) => void ? I : never;
/**
 * Helper to create a type guard for the intersection of up to 3 types.
 * @example
 * interface Foo { a: string }
 * const isFoo: Is<Foo> = isStruct({a: isString})
 *
 * interface Bar extends Foo { b: number }
 * const isBar: Is<Bar> = isIntersection(isFoo, isStruct({ b: isNumber }))
 */
export function isIntersection<T extends any[]>(...args: { [I in keyof T]: Is<T[I]> }): Is<IntersectTupleElements<T>> {
  return (u: unknown): u is IntersectTupleElements<T> => args.every(isX => isX(u))
}

declare class NonEmptyStringTag {
  private __tag: 'NonEmptyString'
}

export type NonEmptyString = string & NonEmptyStringTag

export const isNonEmptyString: Is<NonEmptyString> = (u: unknown): u is NonEmptyString =>
  typeof u === 'string' && u.length > 0
