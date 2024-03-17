import { createPortal } from "react-dom";
import StartView from "./views/start";
import appStore from "./store/app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Toast from "@fourviere/ui/lib/modals/toast";
import { ErrorBox } from "@fourviere/ui/lib/box";
import EditFeed from "./views/edit-feed";
import General from "./views/edit-feed/general";
import FeedConfiguration from "./views/edit-feed/_configuration";
import GlobalConfiguration from "./views/configuration";
import { attachConsole } from "@tauri-apps/plugin-log";
import ItemsIndex from "./views/edit-item/items-index";
import ItemGeneral from "./views/edit-item/item-general";
import Configuration from "./views/edit-feed/forms/configuration";

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
        path: "feed-basic",
        Component: General,
      },
      {
        path: "feed-config",
        Component: Configuration,
      },
      {
        path: "feed-items",
        children: [
          { path: "", Component: ItemsIndex },
          {
            path: ":itemGUID",
            Component: ItemGeneral,
          },
        ],
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
