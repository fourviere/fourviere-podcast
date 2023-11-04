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
exports.SideMenuItem = void 0;
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const SideMenu = ({ main, header, footer }) => {
    return (react_1.default.createElement("div", { className: "h-full flex flex-col space-y-2 w-1/5" },
        header && react_1.default.createElement("div", { className: "grow-0" }, header),
        main && (react_1.default.createElement("div", { className: "grow shrink overflow-scroll space-y-2 inner-shadow p-6" }, main)),
        footer && react_1.default.createElement("div", { className: "grow-0" }, footer)));
};
function SideMenuItem(_a) {
    var { children, component, className } = _a, props = __rest(_a, ["children", "component", "className"]);
    const Component = component !== null && component !== void 0 ? component : "div";
    return (react_1.default.createElement(Component, Object.assign({ className: (0, classnames_1.default)("side-menu-item text-sm block font-semibold text-slate-400 hover:text-slate-900 transition-all duration-300 ease-in-out", className) }, props), children));
}
exports.SideMenuItem = SideMenuItem;
exports.default = SideMenu;
