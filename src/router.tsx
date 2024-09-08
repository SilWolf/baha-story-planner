import { createBrowserRouter } from "react-router-dom";

import RootPage from "./pages//page";
import AppLayout from "./pages/app/layout";
import AppPage from "./pages/app/page";
import StoriesByIdPage from "./pages/app/stories/[id]/page";
import StoriesPage from "./pages/app/stories/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <AppPage />,
      },
      {
        path: "stories",
        element: <StoriesPage />,
        children: [],
      },
      {
        path: "stories/:id",
        element: <StoriesByIdPage />,
        children: [],
      },
    ],
  },
]);

export default router;
