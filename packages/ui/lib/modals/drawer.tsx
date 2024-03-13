import tw from "tailwind-styled-components";
import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

const Backdrop = ({ onClick }: { onClick: React.MouseEventHandler }) => (
  <motion.button
    className="fixed inset-0 bg-slate-900/90"
    initial={{ opacity: 0 }}
    onClick={onClick}
    animate={{
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.6 },
      zIndex: 10000,
    }}
    exit={{
      opacity: 0,
      transition: { delay: 0.5, ease: "easeOut" },
    }}
  />
);

const CloseButton = ({
  className,
  onClick,
}: React.ButtonHTMLAttributes<{ className: string }>) => {
  return (
    <button
      onClick={onClick}
      className={classNames("absolute z-20 ", className)}
    >
      <div>&times;</div>
    </button>
  );
};

const containerTypes = {
  top: {
    classes: `fixed top-0 right-0 left-0`,
    closeButton:
      "-bottom-8 leading-none w-8 h-8 right-5 bg-white text-slate-800 items-center justify-center rounded-b-full bg-slate-100",

    animations: {
      initial: { translateY: -100, opacity: 0 },
      animate: {
        translateY: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
        zIndex: 100000,
      },
      exit: {
        translateY: -100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  bottom: {
    classes: `fixed bottom-0 right-5 left-5 rounded-t-xl`,
    closeButton:
      "-top-8 leading-none w-8 h-8 right-5 bg-white text-slate-800 items-center justify-center rounded-t-full bg-slate-100",

    animations: {
      initial: { translateY: 100, opacity: 0, zIndex: 100000 },
      animate: {
        translateY: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
        zIndex: 100000,
      },
      exit: {
        translateY: 100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  left: {
    classes: `fixed top-0 bottom-0 left-0`,
    closeButton:
      "-rigth-8 leading-none w-8 h-8 top-5 bg-white text-slate-800 items-center justify-center rounded-l-full bg-slate-100",

    animations: {
      initial: { translateX: -100, opacity: 0, zIndex: 100000 },
      animate: {
        translateX: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
        zIndex: 100000,
      },
      exit: {
        translateX: -100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  right: {
    classes: `fixed top-0 bottom-0 right-0 roundeed-l-full w-3/4 flex flex-col`,
    closeButton:
      "-left-8 leading-none w-8 h-8 top-5 bg-white text-slate-800 items-center justify-center rounded-l-full bg-slate-100",
    animations: {
      initial: { translateX: 100, opacity: 0 },
      animate: {
        translateX: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
        zIndex: 100000,
      },
      exit: {
        translateX: 100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
} as const;

type ContainerType = keyof typeof containerTypes;
const Container = ({
  children,
  onClose,
  type,
}: PropsWithChildren<{
  onClose: React.MouseEventHandler;
  type: ContainerType;
}>) => (
  <motion.div
    className={`${containerTypes[type].classes} bg-white shadow-lg`}
    {...containerTypes[type].animations}
  >
    <CloseButton
      className={containerTypes[type].closeButton}
      onClick={onClose}
    />
    {children}
  </motion.div>
);

const OuterContainer = tw.div`fixed top-0 right-0 bottom-0 left-0 z-30`;

function Drawer({
  onClose,
  children,
  type,
}: PropsWithChildren<{
  onClose: () => void;
  type: ContainerType;
}>) {
  return (
    <OuterContainer>
      <Backdrop onClick={onClose}></Backdrop>
      <Container onClose={onClose} type={type}>
        {children}
      </Container>
    </OuterContainer>
  );
}

export default Drawer;
