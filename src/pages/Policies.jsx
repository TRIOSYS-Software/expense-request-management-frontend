import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PoliciesTable } from "../components/PoliciesTable";
import { useNavigate } from "react-router-dom";
import PoliciesDataTable from "../components/PoliciesDataTable";

export function Policies() {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography variant="h5">Approval Policies</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ display: "flex" }}
          onClick={() => {
            navigate("/policies/form");
          }}
        >
          Policy
        </Button>
      </Box>
      <PoliciesDataTable />
    </Box>
  );
}
