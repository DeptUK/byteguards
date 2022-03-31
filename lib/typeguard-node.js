"use strict";
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
exports.TypeguardNode = void 0;
var indefinite_article_1 = require("./indefinite-article");
var nullOrUndefined = function (value) { return ['null', 'undefined'].indexOf(value) > -1; };
var TypeguardNode = /** @class */ (function () {
    function TypeguardNode(name, type) {
        this.name = name;
        this._type = type;
        this._foundType = '';
        this._andChildren = [];
        this._orChildren = [];
        this._valid = undefined;
        this._isTopLevel = true;
        this._details = [];
    }
    Object.defineProperty(TypeguardNode.prototype, "andChildren", {
        get: function () {
            return this._andChildren;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeguardNode.prototype, "orChildren", {
        get: function () {
            return this._andChildren;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeguardNode.prototype, "type", {
        get: function () {
            if (this._type === 'union' || this._type === 'unionElement') {
                return this._orChildren.map(function (e) { return e.type; }).join(' or ');
            }
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeguardNode.prototype, "isTopLevel", {
        get: function () {
            return this._isTopLevel;
        },
        set: function (value) {
            this._isTopLevel = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeguardNode.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (value) {
            this._parent = value;
        },
        enumerable: false,
        configurable: true
    });
    TypeguardNode.prototype.resetOr = function () {
        this._orChildren = [];
    };
    TypeguardNode.prototype.addAndChild = function (child) {
        child.isTopLevel = false;
        child.parent = this;
        return this._andChildren.push(child);
    };
    TypeguardNode.prototype.addOrChild = function (child) {
        child.isTopLevel = false;
        child.parent = this;
        return this._orChildren.push(child);
    };
    Object.defineProperty(TypeguardNode.prototype, "foundType", {
        get: function () {
            return this._foundType;
        },
        set: function (value) {
            this._foundType = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeguardNode.prototype, "valid", {
        get: function () {
            if (this._valid !== undefined)
                return this._valid;
            if (!this._orChildren.length && !this._andChildren.length) {
                throw new Error("".concat(this.name, " is an endpoint that hasn't been evaluated"));
            }
            if (this._orChildren.length && this._orChildren.some(function (e) { return e.valid; })) {
                this._valid = true;
                return true;
            }
            if (this._andChildren.length && this._andChildren.every(function (e) { return e.valid; })) {
                this._valid = true;
                return true;
            }
            return false;
        },
        set: function (value) {
            if (this._valid !== false) {
                this._valid = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    TypeguardNode.prototype.addDetails = function (detail) {
        this._details.push(detail);
    };
    Object.defineProperty(TypeguardNode.prototype, "details", {
        get: function () {
            var e_1, _a;
            var output = [];
            try {
                for (var _b = __values(__spreadArray(__spreadArray([], __read(this._orChildren), false), __read(this._andChildren), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    output.push.apply(output, __spreadArray([], __read(child._details), false));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return __spreadArray(__spreadArray([], __read(output), false), __read(this._details), false).join('\n');
        },
        enumerable: false,
        configurable: true
    });
    TypeguardNode.prototype.getOffender = function () {
        var _this = this;
        if (this.valid) {
            throw new Error("".concat(this.name, " was valid, but was asked to provide an offender"));
        }
        if (!this._orChildren.length && !this._andChildren.length) {
            var article = nullOrUndefined(this.foundType) ? '' : "".concat((0, indefinite_article_1.indefiniteArticle)(this.foundType), " ");
            return "".concat(this.name, " was ").concat(article).concat(this.foundType, ", expected ").concat(this.type);
        }
        if (this._orChildren.length) {
            var orFoundTypes = this._orChildren.map(function (e) { return e.foundType; });
            var foundType = this.foundType ||
                Array.from(new Set(orFoundTypes))
                    .filter(function (e) { return e; })
                    .join('/');
            var article = nullOrUndefined(foundType) ? '' : "".concat((0, indefinite_article_1.indefiniteArticle)(foundType), " ");
            if (!foundType && this._orChildren.every(function (e) { return e.name; })) {
                return "".concat(this.name, " failed these tests: ").concat(this._orChildren
                    .map(function (e) { return e.name; })
                    .filter(function (f) { return f !== 'Union'; })
                    .join(', '));
            }
            return "".concat(this.name, " was ").concat(article).concat(foundType, ", expected ").concat(this._orChildren.map(function (e) { return e.type; }).join(' or '));
        }
        if (this._andChildren.length) {
            return "".concat(this._andChildren
                .filter(function (e) { return !e.valid; })
                .map(function (f) { return "".concat(_this.name, ".").concat(f.getOffender()); })
                .join('. '));
        }
        throw new Error("".concat(this.name, " was invalid but cannot provide an offender"));
    };
    return TypeguardNode;
}());
exports.TypeguardNode = TypeguardNode;
//# sourceMappingURL=typeguard-node.js.map