import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import PostListPage from "./routes/PostListPage.jsx";
import ProfilePage from "./routes/ProfilePage.jsx"; 
import Write from "./routes/Write.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      { 
        path: "/profile", 
        element: <ProfilePage /> 
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
      </QueryClientProvider>
  </StrictMode>
);
