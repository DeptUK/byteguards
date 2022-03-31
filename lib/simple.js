"use strict";
/*
@deprecated
This whole file is deprecated, but it's still useful if you need something really simple and fast at boundaries.
*/
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyString = exports.isIntersection = exports.isUnion = exports.isRecord = exports.isStruct = exports.isArray = exports.isRequired = exports.isOptional = exports.isNullable = exports.isLiteral = exports.isUndefined = exports.isNull = exports.isObject = exports.isNumber = exports.isString = exports.isBoolean = exports.isUnknown = void 0;
/** Use this when you need a type guard but don't care about the result. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var isUnknown = function (u) { return (u ? true : true); };
exports.isUnknown = isUnknown;
var isBoolean = function (u) { return typeof u === 'boolean'; };
exports.isBoolean = isBoolean;
var isString = function (u) { return typeof u === 'string'; };
exports.isString = isString;
var isNumber = function (u) { return typeof u === 'number'; };
exports.isNumber = isNumber;
var isObject = function (u) { return typeof u === 'object'; };
exports.isObject = isObject;
var isNull = function (u) { return u === null; };
exports.isNull = isNull;
var isUndefined = function (u) { return u === undefined; };
exports.isUndefined = isUndefined;
var isLiteral = function () {
    var as = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        as[_i] = arguments[_i];
    }
    return function (u) {
        var e_1, _a;
        try {
            for (var as_1 = __values(as), as_1_1 = as_1.next(); !as_1_1.done; as_1_1 = as_1.next()) {
                var a = as_1_1.value;
                if (a === u)
                    return true;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (as_1_1 && !as_1_1.done && (_a = as_1.return)) _a.call(as_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
};
exports.isLiteral = isLiteral;
/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
var isNullable = function (isa) { return function (u) { return (0, exports.isNull)(u) || isa(u); }; };
exports.isNullable = isNullable;
/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
var isOptional = function (isa) { return function (u) { return (0, exports.isUndefined)(u) || isa(u); }; };
exports.isOptional = isOptional;
/**
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
var isRequired = function (isa) { return function (u) { return !(0, exports.isUndefined)(u) && isa(u); }; };
exports.isRequired = isRequired;
/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
var isArray = function (isa) { return function (u) { return Array.isArray(u) && u.every(isa); }; };
exports.isArray = isArray;
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
var isStruct = function (isas) { return function (o) {
    if (o === null || typeof o !== 'object')
        return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var a = o;
    for (var k in isas) {
        if (!isas[k](a[k])) {
            return false;
        }
    }
    return true;
}; };
exports.isStruct = isStruct;
/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
var isRecord = function (isK, isV) { return function (r) {
    if (r === null || typeof r !== 'object')
        return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var a = r;
    for (var k in a) {
        if (!isK(k) || !isV(a[k]))
            return false;
    }
    return true;
}; };
exports.isRecord = isRecord;
/**
 * Helper to create a type guard for a union with up to 5 options.
 *
 * @example
 * type Foo = string | number
 * const isFoo: Is<Foo> = isUnion(isString, isNumber)
 * @example
 * type Bar = string | number | null
 * const isBar: Is<Bar> = isUnion(isString, isNumber, isNull)
 *
 * You can combine them if you need more than 5 options, like this:
 * @example
 * const isBar2: Is<Bar> = isUnion(isString, isUnion(isNumber, isBigint))
 */
function isUnion(isA, isB, isC, isD, isE, isF) {
    return function (u) {
        return isA(u) || isB(u) || (isC && isC(u)) || (isD && isD(u)) || (isE && isE(u)) || (isF && isF(u)) || false;
    };
}
exports.isUnion = isUnion;
/**
 * Helper to create a type guard for the intersection of up to 3 types.
 * @example
 * interface Foo { a: string }
 * const isFoo: Is<Foo> = isStruct({a: isString})
 *
 * interface Bar extends Foo { b: number }
 * const isBar: Is<Bar> = isIntersection(isFoo, isStruct({ b: isNumber }))
 */
function isIntersection(isA, isB, isC) {
    return function (u) { return isA(u) && isB(u) && (!isC || isC(u)); };
}
exports.isIntersection = isIntersection;
var isNonEmptyString = function (u) {
    return typeof u === 'string' && u.length > 0;
};
exports.isNonEmptyString = isNonEmptyString;
//# sourceMappingURL=simple.js.map