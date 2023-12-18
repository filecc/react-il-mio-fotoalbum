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
import Feed from "./components/Feed.tsx";
import Loader from "./components/Loader.tsx";
import ErrorPage from "./error-page.tsx";
import UserPublic from "./components/UserPublic.tsx";
import Register from "./components/Register.tsx";
import Home from "./components/admin/Home.tsx";
import Dashboard from "./components/admin/Dashboard.tsx";

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
const checkAdmin = async () => {
  const res = await fetch("http://localhost:4000/admin/", {
    credentials: "include",
  })
  const data = await res.json()
  if (data.code != 200) {
    return redirect("/login");
  }
  return true
}
const redirectLoggedUser = async () => {
  const res = await fetch("http://localhost:4000/user/isLogged", {
    credentials: "include",
  })
  const data = await res.json()
  if (data.result) {
    return redirect("/profile");
  }
  return true
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
    loader: redirectLoggedUser
  },
  {
    path: "/register",
    element: <Register />,
    loader: redirectLoggedUser
  },
  {
    path: "/profile",
    element: <Profile />,
    loader: checkUserLogged,
  },
  {
    path: "/photos",
    element: <Feed />,
  },
  {
    path: "/photos/:id",
    element: <UserPublic />
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
  },
  {
    path: "/admin",
    element: <Home />,
    loader: checkAdmin,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </React.StrictMode>
);
