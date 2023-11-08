"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function FormRow({ children, name, label, slot, }) {
    return (react_1.default.createElement("div", { className: "w-full" },
        react_1.default.createElement("div", { className: "flex w-full" },
            label && (react_1.default.createElement("label", { htmlFor: name, className: "text-xs text-slate-600 capitalize font-semibold grow mb-px ml-2" }, label !== null && label !== void 0 ? label : name)),
            slot),
        children));
}
exports.default = FormRow;
