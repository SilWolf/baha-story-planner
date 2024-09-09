import "./index.css";

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { themeChange } from "theme-change";

import router from "./router.tsx";

const Main = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
