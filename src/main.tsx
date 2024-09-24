import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { themeChange } from "theme-change";

import firebaseConfig from "@/env/firebase-credentials";

import { AuthProvider } from "./providers/AuthProvider/index.tsx";
import { FirebaseProvider } from "./providers/FirebaseProvider/index.tsx";
import router from "./router.tsx";

const queryClient = new QueryClient();

const Main = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <FirebaseProvider config={firebaseConfig}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </FirebaseProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
