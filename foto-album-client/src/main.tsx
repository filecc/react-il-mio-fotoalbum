import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Layout from "./layout.tsx";
import { NextUIProvider } from "@nextui-org/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </NextUIProvider>
  </React.StrictMode>
);
