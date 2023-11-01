"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.H1Link = exports.H1 = void 0;
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
exports.H1 = tailwind_styled_components_1.default.span `text-xl`;
exports.H1Link = tailwind_styled_components_1.default.a `text-xl hover:underline hover:text-rose-600 font-semibold cursor-pointer`;
