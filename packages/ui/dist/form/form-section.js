"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const usehooks_1 = require("@uidotdev/usehooks");
const typography_1 = require("../typography");
function FormSection({ title, description, children, }) {
    const [ref, entry] = (0, usehooks_1.useIntersectionObserver)({
        threshold: 0.7,
        root: null,
        rootMargin: "0px",
    });
    return (react_1.default.createElement("section", { className: (0, classnames_1.default)("md:flex transition-all duration-1000", {
            "opacity-100": entry === null || entry === void 0 ? void 0 : entry.isIntersecting,
            "opacity-40": !(entry === null || entry === void 0 ? void 0 : entry.isIntersecting),
        }), id: "general", ref: ref },
        react_1.default.createElement("div", { className: "p-5 space-y-3 lg:w-1/3 md:w-[200px] md:shrink-0 xl:w-1/4" },
            react_1.default.createElement(typography_1.H1, null, title),
            description && react_1.default.createElement("p", { className: "text-xs text-slate-400" }, description)),
        children));
}
exports.default = FormSection;
