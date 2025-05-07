import {
  AddAlert,
  Check,
  ExpandLess,
  ExpandMore,
  Pending,
  RampRight,
  RampRightRounded,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
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
  Modal,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  deleteExpenseRequest,
  fetchExpenseAttachment,
  fetchExpenseRequests,
  fetchExpenseRequestsByUserID,
  updateExpenseApprovals,
} from "../libs/fetcher";
import { useMutation, useQuery } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";

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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

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

export default function ExpenseRequestList({ data }) {
  const [value, setValue] = useState(0);
  const { auth } = useApp();
  // const { data, isLoading, isError, error } = useQuery("expenses", () => {
  //   if (auth.role === 1) {
  //     return fetchExpenseRequests();
  //   } else {
  //     return fetchExpenseRequestsByUserID(auth.id);
  //   }
  // });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // if (isLoading) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
  //       <Alert severity="error">{error.message}</Alert>
  //     </Box>
  //   );
  // }

  const filterByStatus = (status) => {
    return data?.filter((expense) => expense.status === status);
  };

  const pendingExpenseRequest = filterByStatus("pending");
  const approvedExpenseRequest = filterByStatus("approved");
  const rejectedExpenseRequest = filterByStatus("rejected");

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                ALL
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
                  label={rejectedExpenseRequest.length}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            }
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {data?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {filterByStatus("pending")?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {filterByStatus("approved")?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {filterByStatus("rejected")?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
    </Box>
  );
}

const ExpenseCard = ({
  id,
  user,
  amount,
  projects,
  payment_methods,
  gl_accounts,
  description,
  status,
  category,
  date_submitted,
  attachment,
  approvals,
  is_send_to_sql_acc,
  auth,
  current_approver_level,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [comments, setComments] = useState("");
  const [selected, setSelected] = useState(null);
  const date = new Date(date_submitted);
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (approval, action) => {
    setSelected(approval);
    setOpen(true);
    setAction(action);
  };

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

  const deleteExpense = useMutation(
    async (id) => await deleteExpenseRequest(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("expenses");
        setGlobalMsg("Expense deleted successfully!");
      },
      onError: () => {
        setGlobalMsg("Expense deletion failed!");
      },
    }
  );

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

  return (
    <Box sx={{ mt: 2 }}>
      <Card
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body1">ID - {id}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{user?.name || "-"}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">
              {amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
            Submitted Date: {date.toLocaleDateString()}
          </Typography>
          {is_send_to_sql_acc && (
            <Tooltip title="Sent to SQLACC">
              <Check color="success" />
            </Tooltip>
          )}
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
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </Card>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Card>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body2">{description}</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Project</Typography>
              <Typography variant="body2">
                {projects.description || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">Attachment</Typography>
              {attachment ? (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleView(attachment);
                  }}
                  download
                >
                  View
                </Button>
              ) : (
                <Typography variant="body2">----</Typography>
              )}
            </Box>
            <Box>
              <Typography variant="h6">Payment Method</Typography>
              <Typography variant="body2">
                {payment_methods.description || "----"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <Typography variant="h6">GL Account</Typography>
                <Typography variant="body2">
                  {gl_accounts.description || "----"}
                </Typography>
              </Box>
            </Box>
          </Box>
          {status === "pending" && auth.role === 3 && (
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  navigate(`/expenses/form/${id}`);
                }}
              >
                Edit
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  deleteExpense.mutate(id);
                }}
              >
                Delete
              </Button>
            </Box>
          )}
          {status === "pending" &&
            (auth.role === 2 || auth.role === 1) &&
            approvals.map((approval, index) => {
              if (
                approval.users.id === auth.id &&
                approval.status === "pending" &&
                approval.level === current_approver_level
              ) {
                return (
                  <Box
                    sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}
                    key={index}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => {
                        handleOpen(approval, "approve");
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      sx={{ ml: 2 }}
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => {
                        handleOpen(approval, "reject");
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                );
              }
            })}
          <Divider />
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
                  {approval.users?.name || "----"}{" "}
                  {approval.status === "pending" ? (
                    <Pending color="warning" />
                  ) : approval.status === "approved" ? (
                    <ThumbUp color="success" />
                  ) : (
                    <ThumbDown color="error" />
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
          <Divider />
        </Card>
      </Collapse>
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
};
