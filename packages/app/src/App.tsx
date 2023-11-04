import { createPortal } from "react-dom";
import StartView from "./views/start";
import appStore from "./store/app";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Toast from "@fourviere/ui/lib/modals/toast";
import { ErrorBox } from "@fourviere/ui/lib/box";
import { FullPageColumnLayout } from "@fourviere/ui/lib/layouts/full-page";
import SideMenu from "./components/side-menu";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FullPageColumnLayout>
        <SideMenu />
        <StartView />
      </FullPageColumnLayout>
    ),
  },
  {
    path: "/config",
    element: (
      <FullPageColumnLayout>
        <SideMenu />
        <div>config</div>
      </FullPageColumnLayout>
    ),
  },
  {
    path: "/feed/:feedId",
    element: (
      <FullPageColumnLayout>
        <SideMenu />
        <Outlet />
      </FullPageColumnLayout>
    ),
    children: [
      {
        path: "",
        element: <div>general</div>,
      },
      {
        path: "episodes",
        element: <div>episodes</div>,
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
