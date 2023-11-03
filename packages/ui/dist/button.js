"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const Button = (_a) => {
    var { children, isLoading } = _a, rest = __rest(_a, ["children", "isLoading"]);
    return (react_1.default.createElement("button", Object.assign({}, rest, { className: (0, classnames_1.default)(`bg-slate-800 hover:bg-slate-600 rounded-lg hover:text-slate-200 font-semibold text-xs uppercase relative py-4 px-6 text-white transition-all duration-200 ease-linear flex items-center`, { "pl-9": isLoading }) }),
        isLoading ? (react_1.default.createElement(outline_1.CloudArrowDownIcon, { className: "absolute w-7 h-7 pl-3 left-0 top-[50%] -translate-y-[50%] text-slate-100" })) : null,
        children));
};
exports.default = Button;
