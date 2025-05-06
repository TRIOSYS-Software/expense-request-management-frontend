import { useState, createContext, useContext, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";

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
import AdminRoute from "./pages/AdminRoute";
import Categories from "./pages/Categories";
import Departments from "./pages/Departments";
import ExpenseFormToSQLACC from "./pages/ExpenseFormToSQLACC";
import UserPaymentMethod from "./pages/UserPaymentMethod";
import AssignPaymentMethod from "./pages/AssignPaymentMethod";
import ChangePassword from "./pages/ChangePassword";
import GLAccounts from "./pages/GLAccounts";
import PaymentMethods from "./pages/PaymentMethods";
import Projects from "./pages/Projects";
import NotFoundPage from "./pages/NotFoundPage";
import AssignGLAcc from "./pages/AssignGLAcc";
import UserGLAcc from "./pages/UserGLAcc";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
    errorElement: <NotFoundPage />,
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
        path: "/expenses/form/:id",
        element: <ExpenseForm />,
      },
      {
        path: "/expenses/:id/send-to-sqlacc",
        element: <ExpenseFormToSQLACC />,
      },
      {
        path: "/users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        ),
      },
      {
        path: "/users/form",
        element: (
          <AdminRoute>
            <UserForm />
          </AdminRoute>
        ),
      },
      {
        path: "/users/form/:id",
        element: (
          <AdminRoute>
            <UserForm />
          </AdminRoute>
        ),
      },
      {
        path: "/payment-methods/assign",
        element: (
          <AdminRoute>
            <UserPaymentMethod />
          </AdminRoute>
        ),
      },
      {
        path: "/payment-methods/assign/form",
        element: (
          <AdminRoute>
            <AssignPaymentMethod />
          </AdminRoute>
        ),
      },
      {
        path: "/gl-accounts/assign",
        element: (
          <AdminRoute>
            <UserGLAcc />
          </AdminRoute>
        ),
      },
      {
        path: "/gl-accounts/assign/form",
        element: (
          <AdminRoute>
            <AssignGLAcc />
          </AdminRoute>
        ),
      },
      {
        path: "/users/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/gl-accounts",
        element: (
          <AdminRoute>
            <GLAccounts />
          </AdminRoute>
        ),
      },
      {
        path: "/payment-methods",
        element: (
          <AdminRoute>
            <PaymentMethods />
          </AdminRoute>
        ),
      },
      {
        path: "/projects",
        element: (
          <AdminRoute>
            <Projects />
          </AdminRoute>
        ),
      },
      {
        path: "/policies",
        element: (
          <AdminRoute>
            <Policies />
          </AdminRoute>
        ),
      },
      {
        path: "/policies/form",
        element: (
          <AdminRoute>
            <PolicyForm />
          </AdminRoute>
        ),
      },
      {
        path: "/policies/form/:id",
        element: (
          <AdminRoute>
            <PolicyForm />
          </AdminRoute>
        ),
      },
      {
        path: "/categories",
        element: (
          <AdminRoute>
            <Categories />
          </AdminRoute>
        ),
      },
      {
        path: "/departments",
        element: (
          <AdminRoute>
            <Departments />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export const queryClient = new QueryClient();

export default function ThemedApp() {
  const [auth, setAuth] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [globalMsg, setGlobalMsg] = useState(null);

  useEffect(() => {
    fetchVerify()
      .then((user) => {
        if (user) setAuth(user);
        setIsLoadingUser(false);
      })
      .catch(() => setIsLoadingUser(false));
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
