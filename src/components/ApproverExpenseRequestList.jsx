import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid2,
  Input,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchExpenseApprovalsByApproverID,
  fetchExpenseRequests,
  fetchExpenseRequestsByApproverID,
  updateExpenseApprovals,
} from "../libs/fetcher";
import { useApp } from "../ThemedApp";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ApproverExpenseRequestList() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [selected, setSelected] = useState(null);
  const { auth, setGlobalMsg } = useApp();

  const { data, isLoading, isError, setError } = useQuery(
    "expense-requests",
    () => fetchExpenseRequestsByApproverID(auth.id)
  );

  const pendingExpenseRequest = data?.filter((r) => r.status === "pending");

  const update = useMutation(
    async (data) => {
      const id = selected.id;
      await updateExpenseApprovals(id, data);
    },
    {
      onSuccess: () => {
        handleClose();
        setGlobalMsg("Expense updated successfully!");
      },
      onError: (error) => {
        setError("root", { message: error.message });
        handleClose();
        setGlobalMsg(error.message);
      },
    }
  );

  const handleOpen = (approval) => {
    setSelected(approval);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    if (action === "approve") {
      const data = {
        status: "approved",
        comments: comments,
        approval_date: new Date().toISOString(),
      };
      update.mutate(data);
    } else {
      const data = {
        status: "rejected",
        comments: comments,
        approval_date: new Date().toISOString(),
      };
      update.mutate(data);
    }
    handleClose();
  };

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
        <Alert severity="error">Error fetching data</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Grid2 container spacing={2}>
        {pendingExpenseRequest?.map((expense) => {
          const date = new Date(expense.date_submitted);
          return (
            <Grid2 key={expense.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h5">{expense.amount}</Typography>
                <Typography variant="body2">{expense.user.name}</Typography>
                <Typography>{date.toLocaleDateString()}</Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}
                >
                  <Chip
                    label={expense.category.name}
                    sx={{ my: 1 }}
                    color="secondary"
                  />
                  <Chip label="Project1" sx={{ my: 1 }} color="secondary" />
                </Box>
                <Typography variant="h6" component={"div"}>
                  Description
                </Typography>
                <Typography component={"p"} variant="body2">
                  {expense.description}
                </Typography>
                {expense.approvals?.map((approval) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                      key={approval.id}
                    >
                      <Typography variant="body2">
                        {approval.users.name}
                      </Typography>
                      <Typography variant="body2">{approval.status}</Typography>
                    </Box>
                  );
                })}
                {expense.approvals.map((approval) => {
                  if (
                    approval.status === "pending" &&
                    approval.users.id === auth.id &&
                    approval.level === expense.current_approver_level
                  ) {
                    return (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                        key={approval.id}
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => {
                            setAction("approve");
                            handleOpen(approval);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setAction("reject");
                            handleOpen(approval);
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    );
                  }
                })}
              </Card>
            </Grid2>
          );
        })}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6">
              {action === "approve" ? "Approve" : "Reject"} Expense
            </Typography>
            <TextField
              id="outlined-basic"
              label="Comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color={action === "approve" ? "success" : "error"}
                onClick={handleAction}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid2>
    </Box>
  );
}
