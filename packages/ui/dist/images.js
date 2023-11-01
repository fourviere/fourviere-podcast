"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquaredImage = void 0;
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
exports.SquaredImage = tailwind_styled_components_1.default.img `w-24 h-24 rounded-lg object-cover`;
