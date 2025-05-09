import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ExpenseRequestList from "../components/ExpenseRequestList";
import { useApp } from "../ThemedApp";
import {
  fetchExpenseRequests,
  fetchExpenseRequestsByApproverID,
  fetchExpenseRequestsByUserID,
} from "../libs";
import { useQuery } from "react-query";
import * as XLSX from "xlsx";

export default function Expenses() {
  const { auth } = useApp();
  const navigate = useNavigate();

  const flattenData = (data) => {
    return data.map((item) => {
      // Flatten the main object
      const flattened = {
        id: item.id,
        amount: item.amount,
        description: item.description,
        // category_id: item.category_id,
        project: item.project,
        payment_method: item.payment_method,
        user_id: item.user_id,
        gl_account: item.gl_accounts.code,
        gl_account_description: item.gl_accounts.description,
        date_submitted: new Date(item.date_submitted).toLocaleDateString(),
        created_at: new Date(item.created_at).toLocaleString(),
        updated_at: new Date(item.updated_at).toLocaleString(),
        status: item.status,
        current_approver_level: item.current_approver_level,
        is_send_to_sql_acc: item.is_send_to_sql_acc,
        user_name: item.user.name, // Flatten user
        user_email: item.user.email, // Flatten user
      };

      // Flatten approvals
      item.approvals.forEach((approval, index) => {
        const approvers = [];
        approvers.push(`(${approval.users.name}, level: ${approval.level})`);
        flattened[`approvers`] = approvers.join(", ");
        flattened[`approval_${index + 1}_id`] = approval.id;
        flattened[`approval_${index + 1}_approver_name`] = approval.users.name;
        flattened[`approval_${index + 1}_approver_email`] =
          approval.users.email;
        flattened[`approval_${index + 1}_status`] = approval.status;
        flattened[`approval_${index + 1}_comments`] = approval.comments;
        flattened[`approval_${index + 1}_approval_date`] = new Date(
          approval.approval_date
        ).toLocaleString();
        flattened[`approval_${index + 1}_is_final`] = approval.is_final;
      });

      return flattened;
    });
  };

  const exportToExcel = (data, fileName) => {
    const flattenData2 = flattenData(data);
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(flattenData2);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write workbook and trigger download
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleExport = () => {
    exportToExcel(data, "Expense-Requests");
  };

  const { data, isLoading, isError, error } = useQuery("expenses", () => {
    if (auth.role === 1) {
      return fetchExpenseRequests();
    } else if (auth.role === 2) {
      return fetchExpenseRequestsByApproverID(auth.id);
    } else {
      return fetchExpenseRequestsByUserID(auth.id);
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "50vh",
          mx: "auto",
          width: "fit-content",
        }}
      >
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

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
        {auth.role === 1 ? (
          <Box>
            <Button
              variant="contained"
              sx={{ display: { xs: "none", md: "flex" } }}
              onClick={handleExport}
            >
              Excel Export
            </Button>
          </Box>
        ) : auth.role === 2 ? null : (
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
      <ExpenseRequestList data={data} />
      {/* {auth.role === 2 ? (
        <ExpenseRequestList2 data={data} />
      ) : (
        <ExpenseRequestList data={data} />
      )} */}
    </Box>
  );
}
