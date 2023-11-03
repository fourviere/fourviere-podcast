"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalfPageBox = exports.Container = void 0;
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const containerXSpaces = {
    none: ``,
    sm: `space-x-1`,
    md: `space-x-2`,
    lg: `space-x-3`,
    xl: `space-x-4`,
    "2xl": `space-x-5`,
    "3xl": `space-x-6`,
    "4xl": `space-x-7`,
    "5xl": `space-x-8`,
};
const containerYSpaces = {
    none: ``,
    sm: `space-y-1`,
    md: `space-y-2`,
    lg: `space-y-3`,
    xl: `space-y-4`,
    "2xl": `space-y-5`,
    "3xl": `space-y-6`,
    "4xl": `space-y-7`,
    "5xl": `space-y-8`,
};
const containerPadding = {
    none: ``,
    sm: `p-1`,
    md: `p-2`,
    lg: `p-3`,
    xl: `p-4`,
    "2xl": `p-5`,
    "3xl": `p-6`,
    "4xl": `p-7`,
    "5xl": `p-8`,
};
const containerFlex = {
    none: ``,
    "row-top": `flex flex-row items-start`,
    "row-middle": `flex flex-row items-center`,
    "row-bottom": `flex flex-row items-end`,
    col: `flex flex-col`,
};
const Container = ({ spaceY = "none", spaceX = "none", padding = "none", flex = "none", children, wFull, }) => {
    return (react_1.default.createElement("div", { className: `${containerXSpaces[spaceX]} ${containerYSpaces[spaceY]} ${containerPadding[padding]} ${containerFlex[flex]} ${wFull ? "w-full" : ""}` }, children));
};
exports.Container = Container;
exports.HalfPageBox = tailwind_styled_components_1.default.div `w-1/2`;
