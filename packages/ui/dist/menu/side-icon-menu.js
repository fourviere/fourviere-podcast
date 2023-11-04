"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideMenuButton = exports.SideIconMenu = void 0;
const react_1 = __importDefault(require("react"));
const SideIconMenu = ({ main, logo, footer }) => {
    return (react_1.default.createElement("div", { className: "bg-slate-900 h-full flex flex-col w-[80px] shadow-lg items-center grow-0 shrink-0 space-y-2 p-2" },
        react_1.default.createElement("div", { className: "grow-0" }, logo),
        react_1.default.createElement("div", { className: "grow shrink overflow-scroll space-y-2 inner-shadow" }, main),
        react_1.default.createElement("div", { className: "grow-0" }, footer)));
};
exports.SideIconMenu = SideIconMenu;
const SideMenuButton = ({ children, onClick, }) => {
    return (react_1.default.createElement("button", { onClick: onClick, className: "w-16 h-16 flex items-center justify-center rounded-lg rouded text-slate-300 hover:text-slate-100 hover:bg-slate-700 hover:border-4 border-slate-700  transition-all duration-200 ease-in-out" }, children));
};
exports.SideMenuButton = SideMenuButton;
