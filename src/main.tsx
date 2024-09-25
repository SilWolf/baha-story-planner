import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { themeChange } from "theme-change";

import { SessionAuthProvider } from "./providers/SessionAuthProvider/index.tsx";
import router from "./router.tsx";

const queryClient = new QueryClient();

const Main = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionAuthProvider>
          <RouterProvider router={router} />
        </SessionAuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
