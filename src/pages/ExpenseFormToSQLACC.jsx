import { useMutation, useQueries, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchExpenseRequestsByID,
  getPaymentMethods,
  sendtoSQLACC,
} from "../libs/fetcher";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ArrowBack, Send } from "@mui/icons-material";
import { queryClient, useApp } from "../ThemedApp";

export default function ExpenseFormToSQLACC() {
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();

  const queries = [
    {
      queryKey: "expense-request",
      queryFn: () => fetchExpenseRequestsByID(id),
    },
    {
      queryKey: "payment-method",
      queryFn: () => getPaymentMethods(),
    },
  ];

  const results = useQueries(queries);

  const [expenseRequest, paymentMethods] = results;

  const [paymentMethod, setPaymentMethod] = useState("");

  const sendToSQLACC = useMutation(sendtoSQLACC, {
    onSuccess: () => {
      setGlobalMsg("Expense sent to SQLACC successfully!");
      queryClient.invalidateQueries("expense-requests");
      navigate(-1);
    },
    onError: () => {
      setGlobalMsg("Expense sent to SQLACC failed!");
    },
  });

  if (expenseRequest.isLoading || paymentMethods.isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (expenseRequest.isError || paymentMethods.isError) {
    return (
      <Box>
        <Alert severity="error">
          {expenseRequest.error || paymentMethods.error}
        </Alert>
      </Box>
    );
  }

  const date = new Date(expenseRequest.data.date_submitted);

  return (
    <Paper sx={{ p: 2, my: 2, mx: "auto", width: "70%" }}>
      <Typography variant="h4">Expense Details</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Amount :</Typography>
        <Typography variant="body2">{expenseRequest.data.amount}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Category :</Typography>
        <Typography variant="body2">
          {expenseRequest.data.category.name}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Description :</Typography>
        <Typography variant="body2">
          {expenseRequest.data.description}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Project :</Typography>
        <Typography variant="body2">{expenseRequest.data.project}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Submitted Date :</Typography>
        <Typography variant="body2">{date.toLocaleDateString()}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Submitted By :</Typography>
        <Typography variant="body2">{expenseRequest.data.user.name}</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Approved By :</Typography>
        <Typography variant="body2">
          {expenseRequest.data.approvals.map((a) => a.users.name).join(", ")}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Status :</Typography>
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {expenseRequest.data.status}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="body2">Payment Methods :</Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          {/* <InputLabel id="payment-method">Payment Method</InputLabel> */}
          <Select
            labelId="payment-method"
            id="payment-method"
            // label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentMethods.data.map((pm) => (
              <MenuItem key={pm.CODE} value={pm.CODE}>
                {pm.JOURNAL} ({pm.DESCRIPTION})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<Send />}
          sx={{ display: { xs: "none", md: "flex" } }}
          onClick={() => {
            const expense = {
              expense_id: expenseRequest.data.id,
              payment_method: paymentMethod,
            };
            sendToSQLACC.mutate(expense);
          }}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
