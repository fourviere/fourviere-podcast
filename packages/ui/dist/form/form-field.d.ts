import React from "react";
import { FieldHookConfig } from "formik";
export declare function FormField({ initValue, as, fieldProps, overrideReset, postSlot, ...props }: {
    initValue: unknown;
    as: React.ComponentType;
    fieldProps?: Record<string, unknown>;
    postSlot?: React.ReactNode;
    overrideReset?: () => void;
} & FieldHookConfig<unknown>): React.JSX.Element;
