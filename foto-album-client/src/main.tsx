import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Layout from "./layout.tsx";
import Login from "./components/Login.tsx";
import Profile from "./components/Profile.tsx";
import Photos from "./components/Photos.tsx";
import Loader from "./components/Loader.tsx";

const checkUserLogged = async () => {
  const res = await fetch("http://localhost:4000/user/isLogged", {
    credentials: "include",
  })
  const data = await res.json()
  if (!data.result) {
    return redirect("/login");
  }
  return true
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
    loader: checkUserLogged
  },
  {
    path: "/photos",
    element: <Photos />
  },
  {
    path: "/logout",
    element: <Loader />,
    loader: async () => {
      await fetch("http://localhost:4000/user/logout", {
        credentials: "include"
      })
      return redirect("/")
    }
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);
