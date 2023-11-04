"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const tailwind_styled_components_1 = __importDefault(require("tailwind-styled-components"));
const side_menu_1 = require("../menu/side-menu");
const FullPageLayoutBackground = tailwind_styled_components_1.default.div `bg-white w-full h-full flex flex-col justify-center items-center background-logo`;
function FullPageWithSideMenu() {
    return (react_1.default.createElement("div", { className: "h-full w-full flex" },
        react_1.default.createElement(side_menu_1.SideIconMenu, null)));
}
exports.default = FullPageWithSideMenu;
