/// <reference types="node" />
import { TypeguardNode } from './typeguard-node';
declare type TypeguardLogger = (input: string) => void;
export declare const typeguardLogger: TypeguardLogger;
/**
 * Represents a type guard from `unknown` to `A`,
 */
export declare type Is<A> = (a: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => a is A;
/**
 * @deprecated This is no longer required as guards are now curried correctly
 Array.filter takes an argument of the form (u, i?, arr?) => boolean, where i is the index of the element, and arr is
 the array being filtered. Now that our typeguards take the form (u, tracker?, logger?) => boolean, they can't be
 curried into things like array.filter() because array.filter doesn't like the fact that the second argument in the
 function can't be a number. Therefore, we need a way to get rid that second argument.
 */
export declare const curryGuard: <T>(isA: Is<T>) => Is<T>;
/** Use this when you need a type guard but don't care about the result. */
export declare const isUnknown: Is<unknown>;
export declare const isBigint: Is<bigint>;
export declare const isBoolean: Is<boolean>;
export declare const isString: Is<string>;
export declare const isNumber: Is<number>;
export declare const isObject: Is<object>;
export declare const isNull: Is<null>;
export declare const isUndefined: (u: unknown, tracker?: number | TypeguardNode | undefined) => u is undefined;
export declare const isBuffer: (u: unknown, tracker?: TypeguardNode | undefined) => u is Buffer;
export declare const isBlob: Is<Blob>;
export declare const isLiteral: <A>(...as: A[]) => Is<A>;
/**
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
export declare const isRequired: <A>(isa: Is<A | undefined>) => (u: unknown, tracker?: TypeguardNode | undefined) => u is A;
/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
export declare const isArray: <A>(isa: Is<A>) => (u: unknown, tracker?: number | TypeguardNode | undefined) => u is A[];
export declare const isSetOf: <A>(isa: Is<A>) => (u: unknown) => u is Set<A>;
export declare const isUndefinedOrNull: Is<undefined | null>;
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
export declare const isStruct: <O extends {
    [key: string]: unknown;
}>(isas: { [K in keyof O]: Is<O[K]>; }, name?: string | undefined) => Is<O>;
/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
export declare const isRecord: <K extends PropertyKey, V>(isK: Is<K>, isV: Is<V>) => Is<Record<K, V>>;
export declare function isUnion<A, B>(isA: Is<A>, isB: Is<B>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B;
export declare function isUnion<A, B, C>(isA: Is<A>, isB: Is<B>, isC: Is<C>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C;
export declare function isUnion<A, B, C, D>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C | D;
export declare function isUnion<A, B, C, D, E>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C | D | E;
export declare function isUnion<A, B, C, D, E, F>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C | D | E | F;
export declare function isUnion<A, B, C, D, E, F, G>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>, isG: Is<G>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C | D | E | F | G;
export declare function isUnion<A, B, C, D, E, F, G, H>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>, isG: Is<G>, isH: Is<H>): (u: unknown, tracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A | B | C | D | E | F | G | H;
export declare function isIntersection<A, B>(isA: Is<A>, isB: Is<B>): (u: unknown, parentTracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A & B;
export declare function isIntersection<A, B, C>(isA: Is<A>, isB: Is<B>, isC: Is<C>): (u: unknown, parentTracker?: TypeguardNode | number, logger?: TypeguardLogger | Array<unknown>) => u is A & B & C;
/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
export declare const isNullable: <A>(isa: Is<A>) => (u: unknown, tracker?: number | TypeguardNode | undefined, logger?: unknown[] | TypeguardLogger | undefined) => u is A | null;
/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
export declare const isOptional: <A>(isa: Is<A>) => (u: unknown, tracker?: number | TypeguardNode | undefined, logger?: unknown[] | TypeguardLogger | undefined) => u is A | undefined;
/**
 * Helper to create a type guard for a tuple of type `A`.
 * @param length length of the tuple
 */
export declare function isArrayWithLength(length: 1): <T>(isT: Is<T>) => (u: unknown) => u is [T];
export declare function isArrayWithLength(length: 2): <T>(isT: Is<T>) => (u: unknown) => u is [T, T];
export declare function isArrayWithLength(length: 3): <T>(isT: Is<T>) => (u: unknown) => u is [T, T, T];
export declare function isArrayWithLength(length: 4): <T>(isT: Is<T>) => (u: unknown) => u is [T, T, T, T];
export declare const hasValuesOf: <A>(isA: Is<A>) => (u: unknown) => u is {
    [x: string]: A;
};
/**
 * This needs some explanation: this is using the JS error handler to generate a name for an anonymous function
 * @param {Is<T>} f
 * @returns {string}
 */
export declare const functionName: <T>(f: Is<T>) => string;
export {};
