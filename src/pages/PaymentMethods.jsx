import { Add, Sync } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { syncPaymentMethods } from "../libs";
import { useState } from "react";
import PaymentMethodsTable from "../components/PaymentMethodsTable";
import { useNavigate } from "react-router-dom";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setGlobalMsg } = useApp();
  const sync = useMutation(syncPaymentMethods, {
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries("payment-methods");
      setGlobalMsg("Payment Methods synced successfully!");
    },
    onError: () => {
      setGlobalMsg("Payment Methods sync failed!");
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onClick = () => sync.mutate();

  return (
    <Box sx={{ px: 4 }}>
      <Box
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5">Payment Methods</Typography>
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
            onClick={onClick}
            variant="contained"
            startIcon={<Sync />}
          >
            Sync
          </Button>
          <Button
            onClick={() => {
              navigate("/payment-methods/assign");
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Assign
          </Button>
        </Box>
      </Box>
      <Box>
        <PaymentMethodsTable />
      </Box>
    </Box>
  );
}
