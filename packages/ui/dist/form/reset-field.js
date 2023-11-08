"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ResetField = ({ onClick }) => {
    return (react_1.default.createElement("button", { className: "absolute right-1 top-[50%] -translate-y-[50%] rounded-full  text-white hover:bg-slate-600 focus:outline-none bg-slate-400", onClick: onClick },
        react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))));
};
exports.default = ResetField;
