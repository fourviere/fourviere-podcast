"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullPageColumnLayout = exports.FullPageLayoutBackground = void 0;
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
exports.FullPageLayoutBackground = tailwind_styled_components_1.default.div `bg-white w-full h-full flex flex-col justify-center items-center background-logo`;
const FullPageColumnLayout = ({ children, }) => {
    return react_1.default.createElement("div", { className: "h-full w-full flex items-stretch" }, children);
};
exports.FullPageColumnLayout = FullPageColumnLayout;
