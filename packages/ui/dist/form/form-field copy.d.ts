import React from "react";
import { FieldHookConfig } from "formik";
export declare function FormField({ initValue, as, fieldProps, ...props }: {
    initValue: unknown;
    as: React.ComponentType;
    fieldProps?: Record<string, unknown>;
} & FieldHookConfig<unknown>): React.JSX.Element;
