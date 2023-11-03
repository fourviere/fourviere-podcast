"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const box_1 = require("@fourviere/ui/lib/box");
const react_1 = __importDefault(require("react"));
const style = ({ error, size }) => (0, classnames_1.default)("shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ", {
    "text-sm": size === "sm",
    "text-base": size === "base",
    "text-lg": size === "lg",
    "text-xl font-light": size === "xl",
    "text-2xl font-light": size === "2xl",
    "text-rose-600 border-rose-600 placeholder:text-rose-400": !!error,
});
const Input = react_1.default.forwardRef(({ label, name, type, placeholder, value, onChange, size = "sm", error, }, ref) => (react_1.default.createElement(box_1.Container, { wFull: true, flex: "col" },
    label && (react_1.default.createElement("label", { className: "block  text-sm font-bold mb-1", htmlFor: name }, label)),
    react_1.default.createElement("input", { ref: ref, className: style({ size, error }), id: name, name: name, type: type, placeholder: placeholder, value: value, onChange: onChange }),
    error && typeof error === "string" && (react_1.default.createElement("div", { className: "text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%" }, error)))));
exports.default = Input;
