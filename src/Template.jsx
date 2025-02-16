import { Box, CircularProgress, Snackbar } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "./ThemedApp";
import Header from "./components/Header";
import { useState } from "react";
import AppDrawer from "./components/AppDrawer";

export default function Template() {
  const {
    auth,
    setAuth,
    globalMsg,
    setGlobalMsg,
    isLoadingUser,
    setIsLoadingUser,
  } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const content = (
    <Box>
      <Header setShowDrawer={setShowDrawer} />
      <AppDrawer showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
      <Outlet />
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={Boolean(globalMsg)}
        autoHideDuration={6000}
        onClose={() => setGlobalMsg(null)}
        message={globalMsg}
      />
    </Box>
  );

  if (!auth || isLoadingUser) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return auth ? content : <Navigate to="/login" />;
}
