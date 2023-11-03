import React, { PropsWithChildren } from "react";
declare const containerTypes: {
    readonly top: {
        readonly classes: "fixed top-0 right-0 left-0 z-30";
        readonly animations: {
            readonly initial: {
                readonly translateY: -100;
                readonly opacity: 0;
            };
            readonly animate: {
                readonly translateY: 0;
                readonly opacity: 1;
                readonly transition: {
                    readonly delay: 0.2;
                    readonly ease: "easeOut";
                };
            };
            readonly exit: {
                readonly translateY: -100;
                readonly opacity: 0;
                readonly transition: {
                    readonly ease: "easeOut";
                };
            };
        };
    };
    readonly bottom: {
        readonly classes: "fixed bottom-0 right-5 left-5 z-30 rounded-t-xl";
        readonly animations: {
            readonly initial: {
                readonly translateY: 100;
                readonly opacity: 0;
            };
            readonly animate: {
                readonly translateY: 0;
                readonly opacity: 1;
                readonly transition: {
                    readonly delay: 0.2;
                    readonly ease: "easeOut";
                };
            };
            readonly exit: {
                readonly translateY: 100;
                readonly opacity: 0;
                readonly transition: {
                    readonly ease: "easeOut";
                };
            };
        };
    };
    readonly left: {
        readonly classes: "fixed top-0 bottom-0 left-0 z-30";
        readonly animations: {
            readonly initial: {
                readonly translateX: -100;
                readonly opacity: 0;
            };
            readonly animate: {
                readonly translateX: 0;
                readonly opacity: 1;
                readonly transition: {
                    readonly delay: 0.2;
                    readonly ease: "easeOut";
                };
            };
            readonly exit: {
                readonly translateX: -100;
                readonly opacity: 0;
                readonly transition: {
                    readonly ease: "easeOut";
                };
            };
        };
    };
    readonly right: {
        readonly classes: "fixed top-0 bottom-0 right-0 z-30";
        readonly animations: {
            readonly initial: {
                readonly translateX: 100;
                readonly opacity: 0;
            };
            readonly animate: {
                readonly translateX: 0;
                readonly opacity: 1;
                readonly transition: {
                    readonly delay: 0.2;
                    readonly ease: "easeOut";
                };
            };
            readonly exit: {
                readonly translateX: 100;
                readonly opacity: 0;
                readonly transition: {
                    readonly ease: "easeOut";
                };
            };
        };
    };
};
type ContainerType = keyof typeof containerTypes;
declare function Drawer({ onClose, children, type, }: PropsWithChildren<{
    onClose: () => void;
    type: ContainerType;
}>): React.JSX.Element;
export default Drawer;
