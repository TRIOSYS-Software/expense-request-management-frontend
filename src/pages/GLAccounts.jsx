import { Add, Sync } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import GLAccountsTable from "../components/GLAccountsTable";
import { useMutation } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { syncGLAccounts } from "../libs/fetcher";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GLAccounts() {
  const [loading, setLoading] = useState(false);
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const sync = useMutation(syncGLAccounts, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries("gl-accounts");
      setGlobalMsg("GL Accounts synced successfully!");
    },
    onError: () => {
      setGlobalMsg("GL Accounts sync failed!");
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const handleSync = () => sync.mutate();

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">GL Accounts</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            loading={loading}
            onClick={handleSync}
            variant="contained"
            startIcon={<Sync />}
          >
            Sync
          </Button>
          <Button
            loading={loading}
            onClick={() => navigate("/gl-accounts/assign")}
            variant="contained"
            startIcon={<Add />}
          >
            Assign
          </Button>
        </Box>
      </Box>
      <Box>
        <GLAccountsTable />
      </Box>
    </Box>
  );
}
