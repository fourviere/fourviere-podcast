"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function Undefined({ onClick }) {
    return (react_1.default.createElement("button", { onClick: onClick, className: "w-full block text-xs text-left uppercase text-slate-600 border border-dashed border-slate-500 p-2 rounded-lg" }, "Click here to assign a value"));
}
exports.default = Undefined;
