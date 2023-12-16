import tw from "tailwind-styled-components";
import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

const Backdrop = ({ onClick }: { onClick: React.MouseEventHandler }) => (
  <motion.button
    className="fixed inset-0 bg-slate-900/90"
    initial={{ opacity: 0 }}
    onClick={onClick}
    animate={{
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.6 },
    }}
    exit={{
      opacity: 0,
      transition: { delay: 0.2, ease: "easeOut" },
    }}
  />
);

const CloseButton = tw.button`rounded-full text-xs absolute right-2 leading-none px-3 py-2.5 top-2 bg-slate-800 hover:bg-slate-900 text-slate-100 hover:rounded-full z-20`;

const containerTypes = {
  top: {
    classes: `fixed top-0 right-0 left-0 z-30`,
    animations: {
      initial: { translateY: -100, opacity: 0 },
      animate: {
        translateY: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
      },
      exit: {
        translateY: -100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  bottom: {
    classes: `fixed bottom-0 right-5 left-5 z-30 rounded-t-xl`,
    animations: {
      initial: { translateY: 100, opacity: 0 },
      animate: {
        translateY: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
      },
      exit: {
        translateY: 100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  left: {
    classes: `fixed top-0 bottom-0 left-0 z-30`,
    animations: {
      initial: { translateX: -100, opacity: 0 },
      animate: {
        translateX: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
      },
      exit: {
        translateX: -100,
        opacity: 0,
        transition: { ease: "easeOut" },
      },
    },
  },
  right: {
    classes: `fixed top-0 bottom-0 right-0 z-30`,
    animations: {
      initial: { translateX: 100, opacity: 0 },
      animate: {
        translateX: 0,
        opacity: 1,
        transition: { delay: 0.2, ease: "easeOut" },
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
    <CloseButton onClick={onClose}>&times;</CloseButton>
    {children}
  </motion.div>
);

const OuterContainer = tw.div`fixed top-0 right-0 bottom-0 left-0 `;

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
