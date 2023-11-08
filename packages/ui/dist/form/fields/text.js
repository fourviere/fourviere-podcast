"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_quill_1 = __importDefault(require("react-quill"));
require("./text.css");
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const style = ({ error, size }) => (0, classnames_1.default)("shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ", {
    "text-sm": size === "sm",
    "text-base": size === "base",
    "text-lg": size === "lg",
    "text-xl font-light": size === "xl",
    "text-2xl font-light": size === "2xl",
    "text-rose-600 border-rose-600 placeholder:text-rose-400": !!error,
});
const Text = react_1.default.forwardRef(({ value, onChange, size = "sm", error }, ref) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_quill_1.default, { onChange: onChange, theme: "bubble", className: style({ size, error }), value: value })));
});
exports.default = Text;
