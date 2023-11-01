"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLinkCardContainer = exports.ImageLinkCard = void 0;
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const outline_1 = require("@heroicons/react/24/outline");
function ImageLinkCard({ src, showError, }) {
    return (react_1.default.createElement("div", { className: "w-24 h-24 relative" },
        react_1.default.createElement("img", { className: "rounded-lg w-24 h-24 object-cover hover:shadow-lg cursor-pointer border hover:border-4 hover:border-solid hover:border-slate-200 transition-all duration-200 ease-in-out", src: src }),
        showError && (react_1.default.createElement("div", { className: "rounded-full bg-rose-600 absolute -top-1 -right-1 z-10 p-px " },
            react_1.default.createElement(outline_1.ExclamationCircleIcon, { className: "h-5 text-white -mt-px" })))));
}
exports.ImageLinkCard = ImageLinkCard;
exports.ImageLinkCardContainer = tailwind_styled_components_1.default.div `flex gap-2 flex-wrap`;
