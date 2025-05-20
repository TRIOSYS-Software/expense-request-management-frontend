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
  updateExpenseApprovals,
} from "../libs";
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
    return data?.filter((expense) => {
      if (status === "pending") {
        return (
          expense.status === status &&
          expense.approvals.some((approval) => {
            return (
              approval.level === expense.current_approver_level &&
              approval.users.id === auth.id
            );
          })
        );
      }
      return expense.status === status;
    });
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
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
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
            {status === "approved" &&
              is_send_to_sql_acc === false &&
              auth.role === 1 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    sx={{}}
                    color="primary"
                    size="small"
                    onClick={() => {
                      navigate(`/expenses/${id}/send-to-sqlacc`);
                    }}
                  >
                    Send to SQL Acc
                  </Button>
                </Box>
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
          {status === "approved" && auth.role === 1 && (
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Approval Status
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {approvals.map((approval, index) => (
                <Box
                  key={approval.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    // p: 2,
                    // bgcolor: approval.status === 'pending' ? 'action.hover' : 'transparent',
                    // borderRadius: 1,
                    // border: '1px solid',
                    // borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle2">
                        Level {approval.level}:
                      </Typography>
                      <Typography variant="body2">
                        {approval.users?.name || "----"}
                      </Typography>
                    </Box>
                    {approval.comments && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          fontStyle: "italic",
                          maxWidth: { xs: "100%", sm: "400px" },
                        }}
                      >
                        "{approval.comments}"
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {approval.status === "pending" ? (
                      <Chip
                        icon={<Pending />}
                        label="Pending"
                        color="warning"
                        size="small"
                      />
                    ) : approval.status === "approved" ? (
                      <Chip
                        icon={<ThumbUp />}
                        label="Approved"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<ThumbDown />}
                        label="Rejected"
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
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
