"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
function RightDrawer({ children, onClose, }) {
    return (react_1.default.createElement("div", { className: `fixed top-0 right-0 bottom-0 left-0 z-20 ` },
        react_1.default.createElement(framer_motion_1.motion.button, { onClick: onClose, className: `fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-70`, initial: { opacity: 0 }, animate: {
                opacity: 1,
                transition: { ease: "easeOut" },
            }, exit: {
                opacity: 0,
                transition: { delay: 0.2, ease: "easeOut" },
            } }),
        react_1.default.createElement(framer_motion_1.motion.div, { className: `fixed top-0 right-0 bottom-0 w-[400px] bg-white shadow-lg`, initial: { translateX: 100, opacity: 0 }, animate: {
                translateX: 0,
                opacity: 1,
                transition: { delay: 0.2, ease: "easeOut" },
            }, exit: {
                translateX: 100,
                opacity: 0,
                transition: { ease: "easeOut" },
            } },
            react_1.default.createElement("button", { onClick: onClose, className: "rounded-full text-xs absolute right-2 leading-none px-3 py-2.5  top-2 bg-slate-800 hover:bg-slate-900 text-slate-100 hover:rounded-full z-20" }, "\u00D7"),
            children)));
}
exports.default = RightDrawer;
