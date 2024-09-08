import { createBrowserRouter } from "react-router-dom";

import RootPage from "./pages//page";
import AppPage from "./pages/app/page";
import StoriesByIdPage from "./pages/app/stories/[id]/page";
import StoriesPage from "./pages/app/stories/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        path: "app",
        element: <AppPage />,
        children: [
          {
            path: "stories",
            element: <StoriesPage />,
            children: [
              {
                path: ":id",
                element: <StoriesByIdPage />,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
