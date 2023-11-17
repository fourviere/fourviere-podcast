import { createPortal } from "react-dom";
import StartView from "./views/start";
import appStore from "./store/app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Toast from "@fourviere/ui/lib/modals/toast";
import { ErrorBox } from "@fourviere/ui/lib/box";
import EditFeed from "./views/edit-feed";
import SourceCode from "./views/edit-feed/source-code";
import General from "./views/edit-feed/general";
import FeedConfiguration from "./views/edit-feed/configuration";
import GlobalConfiguration from "./views/configuration";
import Itunes from "./views/edit-feed/itunes";
import { attachConsole } from "@tauri-apps/plugin-log";

const detach = await attachConsole();

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartView />,
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
        path: "feed-basic",
        Component: General,
      },
      {
        path: "artwork",
        element: <div>artwork</div>,
      },
      {
        path: "feed-itunes",
        element: <Itunes />,
      },
      {
        path: "feed-source-code",
        element: <SourceCode />,
      },
      {
        path: "feed-config",
        Component: FeedConfiguration,
      },
      {
        path: "episodes/:episodeId",
        element: <div>episode</div>,
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
          document.getElementById("errors")!
        )}
    </>
  );
}

export default App;
