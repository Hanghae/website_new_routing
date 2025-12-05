// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client"; // ← 이 줄이 빠져 있었음!
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeroScroll from "./pages/HeroScroll";
import WorkDetail from "./pages/WorkDetail";
import "./index.css"; // Tailwind 쓰면 포함

const router = createBrowserRouter([
  { path: "/", element: <HeroScroll /> },
  { path: "/work/:slug", element: <WorkDetail /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
