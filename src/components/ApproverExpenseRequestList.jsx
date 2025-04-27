import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid2,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  fetchExpenseAttachment,
  fetchExpenseRequestsByApproverID,
  updateExpenseApprovals,
} from "../libs/fetcher";
import { queryClient, useApp } from "../ThemedApp";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { random } from "node-forge";

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

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ApproverExpenseRequestList({ data }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [selected, setSelected] = useState(null);
  const { auth, setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const categorizeExpenseRequests = (status) =>
    data?.filter((r) => r.status === status);

  const pendingExpenseRequest = categorizeExpenseRequests("pending");
  const approvedExpenseRequest = categorizeExpenseRequests("approved");
  const rejectedExpenseRequest = categorizeExpenseRequests("rejected");

  const update = useMutation(
    async (data) => {
      const id = selected.id;
      await updateExpenseApprovals(id, data);
    },
    {
      onSuccess: () => {
        handleClose();
        setGlobalMsg("Expense updated successfully!");
        queryClient.invalidateQueries("expenses");
      },
      onError: (error) => {
        setError("root", { message: error.message });
        handleClose();
        setGlobalMsg(error.message);
      },
    }
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = (approval) => {
    setSelected(approval);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = () => {
    const data = {
      status: action === "approve" ? "approved" : "rejected",
      comments: comments,
      approval_date: new Date().toISOString(),
    };
    update.mutate(data);
    handleClose();
    setComments("");
  };

  const handleView = async (file) => {
    try {
      const blob = await fetchExpenseAttachment(file);

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Open the file in a new tab
      window.open(url, "_blank");

      // Clean up (optional, but recommended)
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Failed to open the file. Please try again later.");
    }
  };

  const renderExpenseList = (expenses) =>
    expenses?.map((expense) => {
      const date = new Date(expense.date_submitted);
      return (
        <Card key={expense.id} sx={{ p: 2, mb: 2 }}>
          <Box>
            <Typography variant="h6">ID - {expense.id}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h5">
                {expense.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                })}{" "}
                <Chip
                  label={expense.status}
                  color={
                    expense.status === "pending"
                      ? "warning"
                      : expense.status === "approved"
                      ? "success"
                      : "error"
                  }
                />
              </Typography>
              <Typography variant="body2">{expense.user.name}</Typography>
              <Typography>{date.toLocaleDateString()}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
              {/* <Chip
                label={expense.category.name}
                sx={{ my: 1 }}
                color="secondary"
              /> */}
              <Chip label={expense.project} sx={{ my: 1 }} color="secondary" />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              pt: 2,
            }}
          >
            <Box>
              <Typography variant="h6" component={"div"}>
                Description
              </Typography>
              <Typography component={"p"} variant="body2">
                {expense.description}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" component={"div"}>
                Attachments
              </Typography>
              {expense.attachment ? (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleView(expense.attachment);
                  }}
                  download
                >
                  View
                </Button>
              ) : (
                <Typography variant="body2">----</Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              pt: 2,
            }}
          >
            <Box>
              <Typography variant="h6" component={"div"}>
                Payment Method
              </Typography>
              <Typography component={"p"} variant="body2">
                {expense.payment_methods.description || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" component={"div"}>
                GL Account
              </Typography>
              <Typography variant="body2">
                {expense.gl_accounts.description || "-"}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Approvals</Typography>
          {expense.approvals?.map((approval) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                key={approval.id}
              >
                <Typography variant="body2">
                  {approval.level}. {approval.users.name} :{" "}
                  {approval.comments || "No comments yet"}
                </Typography>
                <Typography
                  color={
                    approval.status === "approved"
                      ? "success"
                      : approval.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                >
                  {approval.status}
                </Typography>
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
          {expense.status === "approved" &&
            expense.approvals.some(
              (approval) =>
                approval.users.id === auth.id && approval.is_final === true
            ) && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    navigate(`/expenses/${expense.id}/send-to-sqlacc`);
                  }}
                  variant="outlined"
                  color="primary"
                  disabled={expense.is_send_to_sql_acc === true}
                >
                  Send To SQL ACC
                </Button>
              </Box>
            )}
        </Card>
      );
    });

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              All
              <Chip
                label={data.length}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              Pending
              <Chip
                label={pendingExpenseRequest.length}
                color="warning"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          }
          {...a11yProps(1)}
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              Approved
              <Chip
                label={approvedExpenseRequest.length}
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          }
          {...a11yProps(2)}
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              Rejected
              <Chip
                label={approvedExpenseRequest.length}
                color="error"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          }
          {...a11yProps(3)}
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        {renderExpenseList(data)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {renderExpenseList(pendingExpenseRequest)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {renderExpenseList(approvedExpenseRequest)}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {renderExpenseList(rejectedExpenseRequest)}
      </CustomTabPanel>
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
    </Box>
  );
}
