// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HeroScroll from "./pages/HeroScroll";
import WorkDetail from "./pages/WorkDetail";
import About from "./pages/About";
import "./index.css";

// i18n
import { I18nProvider } from "./i18n";

const router = createBrowserRouter([
  { path: "/", element: <HeroScroll /> },
  { path: "/about", element: <About /> },
  { path: "/work/:slug", element: <WorkDetail /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </React.StrictMode>
);
