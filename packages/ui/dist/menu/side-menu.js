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
const react_1 = __importDefault(require("react"));
const SideMenu = ({ main, header, footer }) => {
    return (react_1.default.createElement("div", { className: "bg-slate-800 grow-0 shrink-0" },
        react_1.default.createElement("div", { className: "bg-white h-full flex flex-col space-y-2 rounded-l-xl" },
            header && react_1.default.createElement("div", { className: "grow-0" }, header),
            main && (react_1.default.createElement("div", { className: "grow shrink overflow-scroll space-y-2 inner-shadow p-6" }, main)),
            footer && react_1.default.createElement("div", { className: "grow-0" }, footer))));
};
function SideMenuItem(_a) {
    var { children, component } = _a, props = __rest(_a, ["children", "component"]);
    const Component = component !== null && component !== void 0 ? component : "div";
    return (react_1.default.createElement(Component, Object.assign({ className: "text-sm font-semibold block" }, props), children));
}
exports.SideMenuItem = SideMenuItem;
exports.default = SideMenu;
