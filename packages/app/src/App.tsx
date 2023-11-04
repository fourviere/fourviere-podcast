import { createPortal } from "react-dom";
import StartView from "./views/start";
import appStore from "./store/app";
import { AnimatePresence } from "framer-motion";
import Toast from "@fourviere/ui/lib/modals/toast";
import { ErrorBox } from "@fourviere/ui/lib/box";

function App() {
  const { errors } = appStore((state) => state);

  return (
    <>
      <StartView />
      {errors.length > 0 &&
        createPortal(
          <AnimatePresence>
            <Toast>
              {errors.map((e) => (
                <ErrorBox>{e.message}</ErrorBox>
              ))}
            </Toast>
          </AnimatePresence>,
          document.getElementById("errors")!
        )}
    </>
  );
}

export default App;
