import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function Toast({ children }: PropsWithChildren<object>) {
  return (
    <motion.div
      className={`fixed bottom-0 left-0 z-30 m-3 space-y-1`}
      initial={{ translateY: 100, opacity: 0 }}
      animate={{
        translateY: 0,
        opacity: 1,
        transition: { ease: "easeOut" },
      }}
      exit={{
        translateY: 100,
        opacity: 0,
        transition: { ease: "easeOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
