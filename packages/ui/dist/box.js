"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxCol = exports.HalfPageBox = void 0;
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
exports.HalfPageBox = tailwind_styled_components_1.default.div `w-1/2`;
exports.BoxCol = tailwind_styled_components_1.default.div `flex-col space-y-6`;
