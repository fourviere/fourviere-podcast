"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageLinkCardContainer = exports.ImageLinkCard = void 0;
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const outline_1 = require("@heroicons/react/24/outline");
const classnames_1 = __importDefault(require("classnames"));
const Sizes = {
    xs: "w-16 h-16",
    sm: "w-20 h-20",
    base: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
};
function ImageLinkCard({ src, showError, onClick, theme = "light", size = "base", faded = false, active = false, }) {
    return (react_1.default.createElement("div", { className: `${Sizes[size]} relative`, onClick: onClick },
        react_1.default.createElement("img", { className: (0, classnames_1.default)(`rounded-lg ${Sizes[size]} object-cover hover:shadow-lg cursor-pointer hover:opacity-100 hover:border-4 hover:border-solid transition-all duration-200 ease-in-out`, {
                "border-slate-200 hover:border-slate-200": theme === "light" && !active,
                "border-slate-900 hover:border-slate-700": theme === "dark" && !active,
                "opacity-30": faded,
                "border-4 border-solid border-slate-200": active,
            }), src: src }),
        showError && (react_1.default.createElement("div", { className: "rounded-full bg-rose-600 absolute -top-1 -right-1 p-px " },
            react_1.default.createElement(outline_1.ExclamationCircleIcon, { className: "h-5 text-white -mt-px" })))));
}
exports.ImageLinkCard = ImageLinkCard;
exports.ImageLinkCardContainer = tailwind_styled_components_1.default.div `flex gap-2 flex-wrap`;
