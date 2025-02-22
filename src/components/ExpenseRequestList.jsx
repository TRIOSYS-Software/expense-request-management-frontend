import { ExpandMore } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  fetchExpenseRequests,
  fetchExpenseRequestsByUserID,
} from "../libs/fetcher";
import { useQuery } from "react-query";
import { useApp } from "../ThemedApp";

export default function ExpenseRequestList() {
  const { auth } = useApp();
  const { data, isLoading, isError, error } = useQuery("expenses", () =>
    fetchExpenseRequestsByUserID(auth.id)
  );

  console.log(data);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {data.map((expense) => (
        <ExpenseCard key={expense.id} {...expense} />
      ))}
    </Box>
  );
}

const ExpenseCard = ({
  id,
  user,
  amount,
  project,
  description,
  status,
  category,
  date_submitted,
  approvals,
}) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(date_submitted);
  return (
    <Box sx={{ mt: 2 }}>
      <Card
        sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="h6">{amount}</Typography>
            <Typography variant="body2">{category?.name || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{user?.name || "-"}</Typography>
            <Typography variant="body2">
              Project: {project || "----"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
            Submitted Date: {date.toLocaleDateString()}
          </Typography>
          <Box>
            <Chip
              label={status}
              color={
                status === "approved"
                  ? "success"
                  : status === "rejected"
                  ? "error"
                  : "warning"
              }
            />
          </Box>
          <ExpandMore />
        </Box>
      </Card>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Card>
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body2">{description}</Typography>
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button size="small" variant="contained" color="primary">
                Approve
              </Button>
              <Button size="small" variant="contained" color="error">
                Reject
              </Button>
            </Box> */}
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Comments</Typography>
            {approvals.map((approval) => (
              <Box
                key={approval.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="body2">
                  {approval.comments || "no comment yet"}
                </Typography>
                <Typography variant="body2">
                  {approval.users?.name || "----"}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider />
        </Card>
      </Collapse>
    </Box>
  );
};
