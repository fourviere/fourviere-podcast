"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormField = void 0;
const react_1 = __importDefault(require("react"));
const undefined_1 = __importDefault(require("@fourviere/ui/lib/form/fields/undefined"));
const formik_1 = require("formik");
const reset_field_1 = __importDefault(require("./reset-field"));
function FormField(_a) {
    var { initValue, as, fieldProps } = _a, props = __rest(_a, ["initValue", "as", "fieldProps"]);
    const Component = as;
    const [field, meta, helpers] = (0, formik_1.useField)(props);
    function reset() {
        helpers.setValue(undefined);
    }
    return (react_1.default.createElement("div", { className: "relative" }, field.value ? (react_1.default.createElement("div", { className: "mr-[24px]" },
        react_1.default.createElement(Component, Object.assign({}, field, props, fieldProps)),
        react_1.default.createElement(reset_field_1.default, { onClick: reset }))) : (react_1.default.createElement(undefined_1.default, { onClick: () => helpers.setValue(initValue) }))));
}
exports.FormField = FormField;
