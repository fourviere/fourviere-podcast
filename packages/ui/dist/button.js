"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
exports.Button = tailwind_styled_components_1.default.button `bg-slate-800 hover:bg-slate-600 rounded-lg hover:text-slate-200 font-semibold text-xs uppercase py-4 px-6 text-white`;
