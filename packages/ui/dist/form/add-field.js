"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("@heroicons/react/24/outline");
const react_1 = __importDefault(require("react"));
const AddField = ({ onClick }) => {
    return (react_1.default.createElement("button", { onClick: onClick, className: "w-5 h-5 text-slate-500 hover:text-slate-700" },
        react_1.default.createElement(outline_1.PlusCircleIcon, null)));
};
exports.default = AddField;
