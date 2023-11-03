"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = void 0;
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
function Toast({ children }) {
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: `fixed left-0 bottom-0 z-30 m-3 space-y-1`, initial: { translateY: 100, opacity: 0 }, animate: {
            translateY: 0,
            opacity: 1,
            transition: { ease: "easeOut" },
        }, exit: {
            translateY: 100,
            opacity: 0,
            transition: { ease: "easeOut" },
        } }, children));
}
exports.Toast = Toast;
