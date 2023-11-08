"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Placeholder = () => {
    return (react_1.default.createElement("button", { className: "border bg-slate-50 border-slate-300 border-dashed p-2 text-slate-400 text-left text-xs uppercase rounded-lg w-full " }, "Click for create!"));
};
exports.default = Placeholder;
