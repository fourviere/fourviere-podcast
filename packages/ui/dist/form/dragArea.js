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
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const Container = tailwind_styled_components_1.default.div `p-6 h-full w-full flex flex-col`;
const BorderedBox = tailwind_styled_components_1.default.div `border-dashed 
border-2 h-full flex flex-col justify-center items-center rounded-lg transition-all duration-900 p-6
${(p) => (!p.isHover && !p.error ? "border-slate-400" : "")}
${(p) => (!!p.error ? "border-rose-500" : "")}
${(p) => (p.isHover ? "border-slate-500" : "")}
`;
const DragArea = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(BorderedBox, Object.assign({}, props), children)));
};
exports.default = DragArea;
