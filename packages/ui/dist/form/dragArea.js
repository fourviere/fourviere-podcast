"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const Container = tailwind_styled_components_1.default.div `p-6 h-full w-full flex flex-col`;
const BorderedBox = tailwind_styled_components_1.default.div `border-dashed 
border-2 h-full flex flex-col justify-center items-center rounded-lg transition-all duration-900 p-6
${(p) => (!p.$isHover && !p.$error ? "border-slate-400" : "")}
${(p) => (!!p.$error ? "border-rose-500" : "")}
${(p) => (p.$isHover ? "border-slate-500" : "")}
`;
const DragArea = ({ children, isHover, error }) => {
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(BorderedBox, { "$isHover": isHover, "$error": error }, children)));
};
exports.default = DragArea;
