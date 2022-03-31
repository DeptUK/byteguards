/**
 * Represents a type guard from `unknown` to `A`,
 */
export declare type Is<A> = (a: unknown) => a is A;
/** Use this when you need a type guard but don't care about the result. */
export declare const isUnknown: Is<unknown>;
export declare const isBoolean: Is<boolean>;
export declare const isString: Is<string>;
export declare const isNumber: Is<number>;
export declare const isObject: Is<object>;
export declare const isNull: Is<null>;
export declare const isUndefined: Is<undefined>;
export declare const isLiteral: <A>(...as: A[]) => Is<A>;
/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
export declare const isNullable: <A>(isa: Is<A>) => (u: unknown) => u is A | null;
/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
export declare const isOptional: <A>(isa: Is<A>) => (u: unknown) => u is A | undefined;
/**
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
export declare const isRequired: <A>(isa: Is<A | undefined>) => (u: unknown) => u is A;
/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
export declare const isArray: <A>(isa: Is<A>) => (u: unknown) => u is A[];
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
export declare const isStruct: <O extends {
    [key: string]: unknown;
}>(isas: { [K in keyof O]: Is<O[K]>; }) => Is<O>;
/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
export declare const isRecord: <K extends PropertyKey, V>(isK: Is<K>, isV: Is<V>) => Is<Record<K, V>>;
export declare function isUnion<A, B>(isA: Is<A>, isB: Is<B>): (u: unknown) => u is A | B;
export declare function isUnion<A, B, C>(isA: Is<A>, isB: Is<B>, isC: Is<C>): (u: unknown) => u is A | B | C;
export declare function isUnion<A, B, C, D>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>): (u: unknown) => u is A | B | C | D;
export declare function isUnion<A, B, C, D, E>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>): (u: unknown) => u is A | B | C | D | E;
export declare function isUnion<A, B, C, D, E, F>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>): (u: unknown) => u is A | B | C | D | E | F;
export declare function isUnion<A, B, C, D, E, F, G>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>, isG: Is<G>): (u: unknown) => u is A | B | C | D | E | F | G;
export declare function isUnion<A, B, C, D, E, F, G, H>(isA: Is<A>, isB: Is<B>, isC: Is<C>, isD: Is<D>, isE: Is<E>, isF: Is<F>, isG: Is<G>, isH: Is<H>): (u: unknown) => u is A | B | C | D | E | F | G | H;
export declare function isIntersection<A, B>(isA: Is<A>, isB: Is<B>): (u: unknown) => u is A & B;
export declare function isIntersection<A, B, C>(isA: Is<A>, isB: Is<B>, isC: Is<C>): (u: unknown) => u is A & B & C;
declare class NonEmptyStringTag {
    private __tag;
}
export declare type NonEmptyString = string & NonEmptyStringTag;
export declare const isNonEmptyString: Is<NonEmptyString>;
export {};
