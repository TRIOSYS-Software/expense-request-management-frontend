import { Box, Button, Typography } from "@mui/material";
import ExpenseTable from "../components/ExpenseTable";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ExpenseRequestList from "../components/ExpenseRequestList";
import { useApp } from "../ThemedApp";
import ApproverExpenseRequestList from "../components/ApproverExpenseRequestList";

export default function Expenses() {
  const { auth } = useApp();
  const navigate = useNavigate();
  return (
    <Box sx={{ px: { xs: 2, md: 4 } }}>
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
        {auth.role !== 3 ? (
          <Box></Box>
        ) : (
          <Box>
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
                navigate("/expenses/form");
              }}
            >
              Add
            </Button>
          </Box>
        )}
      </Box>
      {auth.role === 2 ? (
        <ApproverExpenseRequestList />
      ) : (
        <ExpenseRequestList />
      )}
    </Box>
  );
}
