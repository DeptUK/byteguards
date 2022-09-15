import { TypeguardNode } from './typeguard-node'

type TypeguardLogger = (input: string) => void

export const typeguardLogger: TypeguardLogger = (input: string): void => {
  console.log(input)
}

/**
 * Represents a type guard from `unknown` to `A`,
 */
export type Is<A> = (a: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => a is A

const updateTracker = (type: string, u: unknown, result: boolean, tracker?: TypeguardNode | number): void => {
  if (tracker && tracker instanceof TypeguardNode) {
    tracker.type = type
    tracker.foundType = u === null ? 'null' : typeof u
    tracker.valid = result
  }
}

const parentIsUnion = (u?: TypeguardNode | number): u is TypeguardNode => {
  return u instanceof TypeguardNode && u.parent instanceof TypeguardNode && u.parent.type === 'union'
}

/**
 * @deprecated This is no longer required as guards are now curried correctly
 Array.filter takes an argument of the form (u, i?, arr?) => boolean, where i is the index of the element, and arr is
 the array being filtered. Now that our typeguards take the form (u, tracker?, logger?) => boolean, they can't be
 curried into things like array.filter() because array.filter doesn't like the fact that the second argument in the
 function can't be a number. Therefore, we need a way to get rid that second argument.
 */
export const curryGuard =
  <T>(isA: Is<T>) => isA

/** Use this when you need a type guard but don't care about the result. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isUnknown: Is<unknown> = (u: unknown, _tracker?: TypeguardNode | number): u is unknown => {
  return true
}

export const isBigint: Is<bigint> = (u: unknown, tracker?: TypeguardNode | number): u is bigint => {
  const result = typeof u === 'bigint'
  updateTracker('BigInt', u, result, tracker)
  return result
}

export const isBoolean: Is<boolean> = (u: unknown, tracker?: TypeguardNode | number): u is boolean => {
  const result = typeof u === 'boolean'
  updateTracker('Boolean', u, result, tracker)
  return result
}

export const isString: Is<string> = (u: unknown, tracker?: TypeguardNode | number): u is string => {
  const result = typeof u === 'string'
  updateTracker('String', u, result, tracker)
  return result
}

export const isNumber: Is<number> = (u: unknown, tracker?: TypeguardNode | number): u is number => {
  const result = typeof u === 'number'
  updateTracker('Number', u, result, tracker)
  return result
}

export const isObject: Is<object> = (u: unknown, tracker?: TypeguardNode | number): u is object => {
  const result = typeof u === 'object'
  updateTracker('Object', u, result, tracker)
  return result
}

export const isNull: Is<null> = (u: unknown, tracker?: TypeguardNode | number): u is null => {
  const result = u === null
  updateTracker('Null', u, result, tracker)
  return result
}

export const isUndefined: Is<undefined> = (u: unknown, tracker?: TypeguardNode | number): u is undefined => {
  const result = u === undefined
  updateTracker('Undefined', u, result, tracker)
  return result
}

export const isBuffer: Is<Buffer> = (u: unknown, tracker?: TypeguardNode | number): u is Buffer => {
  const result = u instanceof Buffer
  updateTracker('Buffer', u, result, tracker)
  return result
}

export const isBlob: Is<Blob> = (u: unknown): u is Blob => u instanceof Blob

const isFunction: Is<Function> = (u: unknown, tracker?: TypeguardNode | number): u is Function => {
  const result = typeof u === 'function'
  updateTracker('Function', u, result, tracker)
  return result
}

export const isLiteral =
  <A>(...as: A[]): Is<A> =>
    (u: unknown, tracker?: TypeguardNode | number): u is A => {
      for (const a of as) {
        const newChild = new TypeguardNode(`${a}`, 'Literal')
        tracker && tracker instanceof TypeguardNode && tracker.addOrChild(newChild)
        const result = a === u
        newChild.valid = result
        if (result) return true
      }
      return false
    }

/**
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
export const isRequired =
  <A>(isa: Is<A | undefined>) =>
    (u: unknown, tracker?: TypeguardNode | number): u is A =>
      !isUndefined(u, tracker) && isa(u, tracker)

/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
export const isArray =
  <A>(isa: Is<A>): Is<Array<A>> =>
    (u: unknown, tracker?: TypeguardNode | number): u is A[] => {
      if (!Array.isArray(u)) {
        updateTracker('Array', u, false, tracker)
        return false
      }
      for (const element of u) {
        const newChild = new TypeguardNode('ArrayElement', 'tbd')
        tracker instanceof TypeguardNode && tracker.addAndChild(newChild)
        if (!isa(element, newChild)) {
          return false
        }
      }
      return true
    }

export const isSetOf =
  <A>(isa: Is<A>): Is<Set<A>> =>
    (u: unknown): u is Set<A> =>
      u instanceof Set && [...u].every(isa)

export const isUndefinedOrNull: Is<undefined | null> = isUnion(isUndefined, isNull)

/**
 * Helper to create a type guard for an object structure `O`.
 *
 * **Danger:** this won't be able to warn you if you forget to check for optional fields,
 * or if you specify additional non-existent fields, so don't do either of those things.
 *
 * @param isas a struct describing the type guards for the fields of `O`
 * @param name the name of the structure
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
export const isStruct = <O extends { [key: string]: unknown }>(
  isas: { [K in keyof O]: Is<O[K]> },
  name?: string
): Is<O> => {
  if (!process || !process.env.VERBOSE_TYPEGUARDS || process.env.VERBOSE_TYPEGUARDS.toLowerCase() === 'false') {
    return (o): o is O => {
      if (o === null || typeof o !== 'object') return false

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = o as any
      for (const k of Object.getOwnPropertyNames(isas)) {
        if (!isas[k](a[k])) return false
      }
      return true
    }
  }

  return (o, parentTracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>): o is O => {
    if (parentTracker && parentTracker instanceof TypeguardNode) {
      parentTracker.name = name || 'struct'
    }
    const tracker =
      parentTracker instanceof TypeguardNode
        ? parentTracker
        : new TypeguardNode(name || 'ROOT', 'struct')
    tracker.type = 'struct'
    if (o === null || typeof o !== 'object') {
      tracker.foundType = typeof o
      tracker.valid = false
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = o as any
    for (const k of Object.getOwnPropertyNames(isas)) {
      const newChild = new TypeguardNode(k, 'tbd')
      tracker.addAndChild(newChild)
      if (!isas[k](a[k], newChild)) {
        if (!parentTracker && isFunction(logger)) {
          logger(tracker.getOffender())
        }
        if(parentIsUnion(parentTracker)) {
          parentTracker.addDetails(tracker.getOffender())
        }
        return false
      }
    }
    return true
  }
}
/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
export const isRecord =
  <K extends PropertyKey, V>(isK: Is<K>, isV: Is<V>): Is<Record<K, V>> =>
    (r): r is Record<K, V> => {
      if (r === null || typeof r !== 'object' || r.constructor !== Object) return false

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = r as any
      for (const k in a) {
        if (!isK(k) || !isV(a[k])) return false
      }
      return true
    }

type UnionTupleElements<T extends Is<unknown>[]> = T extends Array<Is<infer U>> ? U : never

/**
 * Helper to create a type guard for a union with multiple options.
 *
 * @example
 * type Foo = string | number
 * const isFoo: Is<Foo> = isUnion(isString, isNumber)
 * @example
 * type Bar = string | number | null
 * const isBar: Is<Bar> = isUnion(isString, isNumber, isNull)
 */
export function isUnion<T extends Is<unknown>[]>(
  ...allTypeGuards: T
): Is<UnionTupleElements<T>> {
  return (u: unknown, parentTacker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>): u is UnionTupleElements<T> => {
    const tracker = parentTacker instanceof TypeguardNode ? parentTacker : new TypeguardNode('ROOT', 'union')
    tracker.type = 'union'
    for (const tg of allTypeGuards) {
      if (tg) {
        const childNode = new TypeguardNode('Union', 'unionElement')
        tracker.addOrChild(childNode)
        if (tg(u, childNode, logger)) {
          return true
        }
      }
    }
    if (tracker.isTopLevel && isFunction(logger)) {
      logger(tracker.details)
      logger(tracker.getOffender())
    }
    return false
  }
}

type RepackagedTuple<T extends any[]> = { [J in keyof T]: (x: T[J]) => void }[number]

type IntersectTupleElements<T extends any[]> = RepackagedTuple<T> extends (x: infer Q) => void ? Q : never;

type TypeGuardOfTypeTuple<T extends any[]> = { [I in keyof T]: Is<T[I]> }
/**
 * Helper to create a type guard for the intersection of multiple types.
 * @example
 * interface Foo { a: string }
 * const isFoo: Is<Foo> = isStruct({a: isString})
 *
 * interface Bar extends Foo { b: number }
 * const isBar: Is<Bar> = isIntersection(isFoo, isStruct({ b: isNumber }))
 */
export function isIntersection<TypeTuple extends any[]>(...args: TypeGuardOfTypeTuple<TypeTuple>): Is<IntersectTupleElements<TypeTuple>> {
  return (u: unknown, parentTracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>): u is IntersectTupleElements<TypeTuple> => {
    const tracker = parentTracker instanceof TypeguardNode ? parentTracker : new TypeguardNode('ROOT', 'Intersection')
    for (const guard of args) {
      if (!guard) {
        return true
      }
      if (!guard(u, tracker)) {
        if (!parentTracker && logger && typeof logger  === 'function') {
          logger(tracker.getOffender())
        }
        return false
      }
      /*
        Because this is a test on the same object, rather than different properties, debugging is better with a single
        tracker, but this can get broken if both of the intersections are union types, so we need this.
       */
      tracker.resetOr()
    }
    return true
  }
}

/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
export const isNullable = <A>(isa: Is<A>) => isUnion(isa, isNull)

/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
export const isOptional = <A>(isa: Is<A>) => isUnion(isa, isUndefined)

export const isDefined = <T = unknown>(u: T): u is NonNullable<T> => typeof u !== 'undefined' && u !== null

/**
 * Helper to create a type guard for a tuple of type `A`.
 * @param length length of the tuple
 */
export function isArrayWithLength(length: 1): <T>(isT: Is<T>) => (u: unknown) => u is [T]
export function isArrayWithLength(length: 2): <T>(isT: Is<T>) => (u: unknown) => u is [T, T]
export function isArrayWithLength(length: 3): <T>(isT: Is<T>) => (u: unknown) => u is [T, T, T]
export function isArrayWithLength(length: 4): <T>(isT: Is<T>) => (u: unknown) => u is [T, T, T, T]
export function isArrayWithLength(length: number) {
  return <T>(isT: Is<T>) =>
    (u: unknown) =>
      isArray(isT)(u) && u.length === length
}

export const hasValuesOf =
  <A>(isA: Is<A>) =>
    (u: unknown): u is { [x: string]: A } =>
      isRecord(isString, isA)(u)

/**
 * This needs some explanation: this is using the JS error handler to generate a name for an anonymous function
 * @param {Is<>} f
 * @returns {string}
 */
export const functionName = (f: Function): string => {
  if (f.name) return f.name
  return 'isCustomStruct'
}
