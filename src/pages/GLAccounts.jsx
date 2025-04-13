import { Sync } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import GLAccountsTable from "../components/GLAccountsTable";
import { useMutation } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { syncGLAccounts } from "../libs/fetcher";
import { useState } from "react";

export default function GLAccounts() {
  const [loading, setLoading] = useState(false);
  const { setGlobalMsg } = useApp();
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

  const onClick = () => sync.mutate();

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">GL Accounts</Typography>
        <Button
          loading={loading}
          onClick={onClick}
          variant="contained"
          startIcon={<Sync />}
        >
          Sync
        </Button>
      </Box>
      <Box>
        <GLAccountsTable />
      </Box>
    </Box>
  );
}
