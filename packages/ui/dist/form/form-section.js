"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const typography_1 = require("../typography");
function FormSection({ title, description, children, }) {
    return (react_1.default.createElement("section", { className: "md:flex transition-all duration-1000 w-full", id: "general" },
        react_1.default.createElement("div", { className: "p-5 space-y-3 lg:w-1/3 md:w-[200px] md:shrink-0 xl:w-1/4" },
            react_1.default.createElement(typography_1.H1, null, title),
            description && react_1.default.createElement("p", { className: "text-xs text-slate-400" }, description)),
        react_1.default.createElement("div", { className: "space-y-8 w-full p-6" }, children)));
}
exports.default = FormSection;
