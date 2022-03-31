"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionName = exports.hasValuesOf = exports.isArrayWithLength = exports.isOptional = exports.isNullable = exports.isIntersection = exports.isUnion = exports.isRecord = exports.isStruct = exports.isUndefinedOrNull = exports.isSetOf = exports.isArray = exports.isRequired = exports.isLiteral = exports.isBlob = exports.isBuffer = exports.isUndefined = exports.isNull = exports.isObject = exports.isNumber = exports.isString = exports.isBoolean = exports.isBigint = exports.isUnknown = exports.curryGuard = exports.typeguardLogger = void 0;
var typeguard_node_1 = require("./typeguard-node");
var typeguardLogger = function (input) {
    console.log(input);
};
exports.typeguardLogger = typeguardLogger;
var updateTracker = function (type, u, result, tracker) {
    if (tracker && tracker instanceof typeguard_node_1.TypeguardNode) {
        tracker.type = type;
        tracker.foundType = u === null ? 'null' : typeof u;
        tracker.valid = result;
    }
};
var parentIsUnion = function (u) {
    return u instanceof typeguard_node_1.TypeguardNode && u.parent instanceof typeguard_node_1.TypeguardNode && u.parent.type === 'union';
};
/**
 * @deprecated This is no longer required as guards are now curried correctly
 Array.filter takes an argument of the form (u, i?, arr?) => boolean, where i is the index of the element, and arr is
 the array being filtered. Now that our typeguards take the form (u, tracker?, logger?) => boolean, they can't be
 curried into things like array.filter() because array.filter doesn't like the fact that the second argument in the
 function can't be a number. Therefore, we need a way to get rid that second argument.
 */
var curryGuard = function (isA) { return isA; };
exports.curryGuard = curryGuard;
/** Use this when you need a type guard but don't care about the result. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var isUnknown = function (u, tracker) {
    return true;
};
exports.isUnknown = isUnknown;
var isBigint = function (u, tracker) {
    var result = typeof u === 'bigint';
    updateTracker('BigInt', u, result, tracker);
    return result;
};
exports.isBigint = isBigint;
var isBoolean = function (u, tracker) {
    var result = typeof u === 'boolean';
    updateTracker('Boolean', u, result, tracker);
    return result;
};
exports.isBoolean = isBoolean;
var isString = function (u, tracker) {
    var result = typeof u === 'string';
    updateTracker('String', u, result, tracker);
    return result;
};
exports.isString = isString;
var isNumber = function (u, tracker) {
    var result = typeof u === 'number';
    updateTracker('Number', u, result, tracker);
    return result;
};
exports.isNumber = isNumber;
var isObject = function (u, tracker) {
    var result = typeof u === 'object';
    updateTracker('Object', u, result, tracker);
    return result;
};
exports.isObject = isObject;
var isNull = function (u, tracker) {
    var result = u === null;
    updateTracker('Null', u, result, tracker);
    return result;
};
exports.isNull = isNull;
var isUndefined = function (u, tracker) {
    var result = u === undefined;
    updateTracker('Undefined', u, result, tracker);
    return result;
};
exports.isUndefined = isUndefined;
var isBuffer = function (u, tracker) {
    var result = u instanceof Buffer;
    updateTracker('Buffer', u, result, tracker);
    return result;
};
exports.isBuffer = isBuffer;
var isBlob = function (u) { return u instanceof Blob; };
exports.isBlob = isBlob;
var isFunction = function (u, tracker) {
    var result = typeof u === 'function';
    updateTracker('Function', u, result, tracker);
    return result;
};
var isLiteral = function () {
    var as = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        as[_i] = arguments[_i];
    }
    return function (u, tracker) {
        var e_1, _a;
        try {
            for (var as_1 = __values(as), as_1_1 = as_1.next(); !as_1_1.done; as_1_1 = as_1.next()) {
                var a = as_1_1.value;
                var newChild = new typeguard_node_1.TypeguardNode("".concat(a), 'Literal');
                tracker && tracker instanceof typeguard_node_1.TypeguardNode && tracker.addOrChild(newChild);
                var result = a === u;
                newChild.valid = result;
                if (result)
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
 * Helper to remove `undefined` from the allowed type,
 * @param isa the type guard for `A`
 */
var isRequired = function (isa) {
    return function (u, tracker) {
        return !(0, exports.isUndefined)(u, tracker) && isa(u, tracker);
    };
};
exports.isRequired = isRequired;
/**
 * Helper to create a type guard for arrays of type `A`.
 * @param isa type guard for the elements of the array
 */
var isArray = function (isa) {
    return function (u, tracker) {
        var e_2, _a;
        if (!Array.isArray(u)) {
            updateTracker('Array', u, false, tracker);
            return false;
        }
        try {
            for (var u_1 = __values(u), u_1_1 = u_1.next(); !u_1_1.done; u_1_1 = u_1.next()) {
                var element = u_1_1.value;
                var newChild = new typeguard_node_1.TypeguardNode('ArrayElement', 'tbd');
                tracker instanceof typeguard_node_1.TypeguardNode && tracker.addAndChild(newChild);
                if (!isa(element, newChild)) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (u_1_1 && !u_1_1.done && (_a = u_1.return)) _a.call(u_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    };
};
exports.isArray = isArray;
var isSetOf = function (isa) {
    return function (u) {
        return u instanceof Set && __spreadArray([], __read(u), false).every((0, exports.curryGuard)(isa));
    };
};
exports.isSetOf = isSetOf;
exports.isUndefinedOrNull = isUnion(exports.isUndefined, exports.isNull);
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
var isStruct = function (isas, name) {
    if (!process.env.VERBOSE_TYPEGUARDS || process.env.VERBOSE_TYPEGUARDS.toLowerCase() === 'false') {
        return function (o) {
            if (o === null || typeof o !== 'object')
                return false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var a = o;
            for (var k in isas) {
                if (!isas[k](a[k]))
                    return false;
            }
            return true;
        };
    }
    return function (o, parentTracker, logger) {
        if (parentTracker && parentTracker instanceof typeguard_node_1.TypeguardNode) {
            parentTracker.name = name || 'struct';
        }
        var tracker = parentTracker instanceof typeguard_node_1.TypeguardNode
            ? parentTracker
            : new typeguard_node_1.TypeguardNode(name || 'ROOT', 'struct');
        tracker.type = 'struct';
        if (o === null || typeof o !== 'object') {
            tracker.foundType = typeof o;
            tracker.valid = false;
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var a = o;
        for (var k in isas) {
            var newChild = new typeguard_node_1.TypeguardNode(k, 'tbd');
            tracker.addAndChild(newChild);
            if (!isas[k](a[k], newChild)) {
                if (!parentTracker && isFunction(logger)) {
                    logger(tracker.getOffender());
                }
                if (parentIsUnion(parentTracker)) {
                    parentTracker.addDetails(tracker.getOffender());
                }
                return false;
            }
        }
        return true;
    };
};
exports.isStruct = isStruct;
/**
 * Helper to create type guards for records.
 *
 * **Note:** the keys are converted to strings (by {@link Object.keys}) before being tested.
 *
 * @param isK type guard for the **name** of the record keys
 * @param isV type guard for the record values
 */
var isRecord = function (isK, isV) {
    return function (r) {
        if (r === null || typeof r !== 'object' || r.constructor !== Object)
            return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var a = r;
        for (var k in a) {
            if (!isK(k) || !isV(a[k]))
                return false;
        }
        return true;
    };
};
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
function isUnion(isA, isB, isC, isD, isE, isF, isG) {
    return function (u, parentTacker, logger) {
        var e_3, _a;
        var allTypeGuards = [isA, isB, isC, isD, isE, isF, isG];
        var tracker = parentTacker instanceof typeguard_node_1.TypeguardNode ? parentTacker : new typeguard_node_1.TypeguardNode('ROOT', 'union');
        tracker.type = 'union';
        try {
            for (var allTypeGuards_1 = __values(allTypeGuards), allTypeGuards_1_1 = allTypeGuards_1.next(); !allTypeGuards_1_1.done; allTypeGuards_1_1 = allTypeGuards_1.next()) {
                var tg = allTypeGuards_1_1.value;
                if (tg) {
                    var childNode = new typeguard_node_1.TypeguardNode('Union', 'unionElement');
                    tracker.addOrChild(childNode);
                    if (tg(u, childNode, logger)) {
                        return true;
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (allTypeGuards_1_1 && !allTypeGuards_1_1.done && (_a = allTypeGuards_1.return)) _a.call(allTypeGuards_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (tracker.isTopLevel && isFunction(logger)) {
            logger(tracker.details);
            logger(tracker.getOffender());
        }
        return false;
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
    return function (u, parentTracker, logger) {
        var e_4, _a;
        var tracker = parentTracker instanceof typeguard_node_1.TypeguardNode ? parentTracker : new typeguard_node_1.TypeguardNode('ROOT', 'Intersection');
        try {
            for (var _b = __values([isA, isB, isC]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var guard = _c.value;
                if (!guard) {
                    return true;
                }
                if (!guard(u, tracker)) {
                    if (!parentTracker && logger && typeof logger === 'function') {
                        logger(tracker.getOffender());
                    }
                    return false;
                }
                /*
                  Because this is a test on the same object, rather than different properties, debugging is better with a single
                  tracker, but this can get broken if both of the intersections are union types, so we need this.
                 */
                tracker.resetOr();
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return true;
    };
}
exports.isIntersection = isIntersection;
/**
 * Helper to add `null` to the allowed type.
 * @param isa the type guard for `A`
 */
var isNullable = function (isa) { return isUnion(isa, exports.isNull); };
exports.isNullable = isNullable;
/**
 * Helper to add `undefined` to the allowed type.
 * @param isa the type guard for `A`
 */
var isOptional = function (isa) { return isUnion(isa, exports.isUndefined); };
exports.isOptional = isOptional;
function isArrayWithLength(length) {
    return function (isT) {
        return function (u) {
            return (0, exports.isArray)(isT)(u) && u.length === length;
        };
    };
}
exports.isArrayWithLength = isArrayWithLength;
var hasValuesOf = function (isA) {
    return function (u) {
        return (0, exports.isRecord)(exports.isString, isA)(u);
    };
};
exports.hasValuesOf = hasValuesOf;
/**
 * This needs some explanation: this is using the JS error handler to generate a name for an anonymous function
 * @param {Is<T>} f
 * @returns {string}
 */
var functionName = function (f) {
    if (f.name)
        return f.name;
    return 'isCustomStruct';
};
exports.functionName = functionName;
//# sourceMappingURL=extended.js.map