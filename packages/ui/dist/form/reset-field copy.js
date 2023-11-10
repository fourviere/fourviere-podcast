"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = __importDefault(require("react"));
const ResetField = ({ onClick }) => {
    return (react_1.default.createElement("button", { onClick: onClick, className: "w-5 h-5 text-rose-500 hover:text-rose-700" },
        react_1.default.createElement(outline_1.XCircleIcon, null)));
};
exports.default = ResetField;
