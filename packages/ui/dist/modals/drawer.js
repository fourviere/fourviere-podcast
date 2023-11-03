"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const Backdrop = ({ onClick }) => (react_1.default.createElement(framer_motion_1.motion.button, { className: "fixed top-0 right-0 bottom-0 left-0 bg-slate-900 bg-opacity-90", initial: { opacity: 0 }, onClick: onClick, animate: {
        opacity: 1,
        transition: { ease: "easeOut", duration: 0.6 },
    }, exit: {
        opacity: 0,
        transition: { delay: 0.2, ease: "easeOut" },
    } }));
const CloseButton = tailwind_styled_components_1.default.button `rounded-full text-xs absolute right-2 leading-none px-3 py-2.5 top-2 bg-slate-800 hover:bg-slate-900 text-slate-100 hover:rounded-full z-20`;
const containerTypes = {
    top: {
        classes: `fixed top-0 right-0 left-0 z-30`,
        animations: {
            initial: { translateY: -100, opacity: 0 },
            animate: {
                translateY: 0,
                opacity: 1,
                transition: { delay: 0.2, ease: "easeOut" },
            },
            exit: {
                translateY: -100,
                opacity: 0,
                transition: { ease: "easeOut" },
            },
        },
    },
    bottom: {
        classes: `fixed bottom-0 right-5 left-5 z-30 rounded-t-xl`,
        animations: {
            initial: { translateY: 100, opacity: 0 },
            animate: {
                translateY: 0,
                opacity: 1,
                transition: { delay: 0.2, ease: "easeOut" },
            },
            exit: {
                translateY: 100,
                opacity: 0,
                transition: { ease: "easeOut" },
            },
        },
    },
    left: {
        classes: `fixed top-0 bottom-0 left-0 z-30`,
        animations: {
            initial: { translateX: -100, opacity: 0 },
            animate: {
                translateX: 0,
                opacity: 1,
                transition: { delay: 0.2, ease: "easeOut" },
            },
            exit: {
                translateX: -100,
                opacity: 0,
                transition: { ease: "easeOut" },
            },
        },
    },
    right: {
        classes: `fixed top-0 bottom-0 right-0 z-30`,
        animations: {
            initial: { translateX: 100, opacity: 0 },
            animate: {
                translateX: 0,
                opacity: 1,
                transition: { delay: 0.2, ease: "easeOut" },
            },
            exit: {
                translateX: 100,
                opacity: 0,
                transition: { ease: "easeOut" },
            },
        },
    },
};
const Container = ({ children, onClose, type, }) => (react_1.default.createElement(framer_motion_1.motion.div, Object.assign({ className: `${containerTypes[type].classes} bg-white shadow-lg` }, containerTypes[type].animations),
    react_1.default.createElement(CloseButton, { onClick: onClose }, "\u00D7"),
    children));
const OuterContainer = tailwind_styled_components_1.default.div `fixed top-0 right-0 bottom-0 left-0 `;
function Drawer({ onClose, children, type, }) {
    return (react_1.default.createElement(OuterContainer, null,
        react_1.default.createElement(Backdrop, { onClick: onClose }),
        react_1.default.createElement(Container, { onClose: onClose, type: type }, children)));
}
exports.default = Drawer;
