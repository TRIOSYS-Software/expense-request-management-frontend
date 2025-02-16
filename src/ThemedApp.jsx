import { useState, createContext, useContext, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Template from "./Template";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import ExpenseForm from "./pages/ExpenseForm";
import Test from "./pages/Test";
import { QueryClientProvider, QueryClient } from "react-query";
import { fetchVerify } from "./libs/fetcher";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import { Policies } from "./pages/Policies";
import PolicyForm from "./pages/PolicyForm";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/expenses",
        element: <Expenses />,
      },
      {
        path: "/expenses/form",
        element: <ExpenseForm />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/form",
        element: <UserForm />,
      },
      {
        path: "/users/form/:id",
        element: <UserForm />,
      },
      {
        path: "/policies",
        element: <Policies />,
      },
      {
        path: "/policies/form",
        element: <PolicyForm />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const queryClient = new QueryClient();

export default function ThemedApp() {
  const [auth, setAuth] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);

  useEffect(() => {
    setIsLoadingUser(true);
    fetchVerify().then((user) => {
      if (user) setAuth(user);
      setIsLoadingUser(false);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider
        value={{
          auth,
          setAuth,
          globalMsg,
          setGlobalMsg,
          isLoadingUser,
          setIsLoadingUser,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
