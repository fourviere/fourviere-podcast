"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideMenuButton = exports.SideIconMenu = void 0;
const react_1 = __importDefault(require("react"));
const react_custom_scrollbars_2_1 = require("react-custom-scrollbars-2");
const SideIconMenu = ({ main, logo, footer }) => {
    return (react_1.default.createElement("div", { className: "bg-slate-800 flex flex-col w-[80px] shadow-lg items-center grow-0 shrink-0 space-y-2 py-2" },
        react_1.default.createElement("div", { className: "grow-0" }, logo),
        react_1.default.createElement(react_custom_scrollbars_2_1.Scrollbars, { thumbSize: 1, className: "grow shrink [&>div]:space-y-3 [&>div]:flex [&>div]:flex-col [&>div]:items-center inner-shadow" }, main),
        react_1.default.createElement("div", { className: "grow-0" }, footer)));
};
exports.SideIconMenu = SideIconMenu;
const SideMenuButton = ({ children, onClick, }) => {
    return (react_1.default.createElement("button", { onClick: onClick, className: "w-16 h-16 flex items-center justify-center rounded-lg rouded text-slate-300 hover:text-slate-100 hover:bg-slate-700 hover:border-4 border-slate-700  transition-all duration-200 ease-in-out" }, children));
};
exports.SideMenuButton = SideMenuButton;
