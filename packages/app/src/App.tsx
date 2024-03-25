import { createPortal } from "react-dom";
import StartView from "./views/start";
import appStore from "./store/app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Toast from "@fourviere/ui/lib/modals/toast";
import { ErrorBox } from "@fourviere/ui/lib/box";
import EditFeed from "./views/feed/channel";
import General from "./views/feed/channel/main";
import GlobalConfiguration from "./views/configuration";
import { attachConsole } from "@tauri-apps/plugin-log";
import Configuration from "./views/feed/channel/configuration";

void attachConsole();

const router = createBrowserRouter([
  {
    path: "/",
    Component: StartView,
  },
  {
    path: "/configurations",
    Component: GlobalConfiguration,
  },
  {
    path: "/feed/:feedId",
    Component: EditFeed,
    children: [
      {
        path: "",
        Component: General,
      },
      {
        path: "feed-config",
        Component: Configuration,
      },
    ],
  },
]);

function App() {
  const { errors } = appStore((state) => state);
  return (
    <>
      <RouterProvider router={router} />
      {errors.length > 0 &&
        createPortal(
          <AnimatePresence>
            <Toast>
              {errors.map((e) => (
                <ErrorBox key={e.id}>{e.message}</ErrorBox>
              ))}
            </Toast>
          </AnimatePresence>,
          document.getElementById("errors")!,
        )}
    </>
  );
}

export default App;
