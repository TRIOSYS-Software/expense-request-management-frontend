import { Box, Button, Typography } from "@mui/material";
import ExpenseTable from "../components/ExpenseTable";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const navigate = useNavigate();
  return (
    <Box sx={{ px: 4 }}>
      <Box
        sx={{
          py: 2,
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "start",
          direction: "row",
          display: "flex",
        }}
      >
        <Typography variant="h5">Expenses Requests List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ display: { xs: "none", md: "flex" } }}
          onClick={() => {
            navigate("/expenses/form");
          }}
        >
          Add Expense
        </Button>
        <Button
          variant="contained"
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            navigate("/expense-form");
          }}
        >
          Add
        </Button>
      </Box>
      <ExpenseTable />
    </Box>
  );
}
