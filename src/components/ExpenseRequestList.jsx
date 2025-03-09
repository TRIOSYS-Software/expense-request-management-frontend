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
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  fetchExpenseRequests,
  fetchExpenseRequestsByUserID,
} from "../libs/fetcher";
import { useQuery } from "react-query";
import { useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";

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

export default function ExpenseRequestList() {
  const [value, setValue] = useState(0);
  const { auth } = useApp();
  const { data, isLoading, isError, error } = useQuery("expenses", () => {
    if (auth.role === 1) {
      return fetchExpenseRequests();
    } else {
      return fetchExpenseRequestsByUserID(auth.id);
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const filterByStatus = (status) => {
    return data?.filter((expense) => expense.status === status);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Pending" {...a11yProps(0)} />
          <Tab label="Approved" {...a11yProps(1)} />
          <Tab label="Rejected" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {filterByStatus("pending")?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {filterByStatus("approved")?.map((expense) => (
          <ExpenseCard key={expense.id} auth={auth} {...expense} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
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
  project,
  description,
  status,
  category,
  date_submitted,
  approvals,
  is_send_to_sql_acc,
  auth,
}) => {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(date_submitted);
  const navigate = useNavigate();
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
            <Typography variant="body2">
              Project: {project || "----"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">{amount}</Typography>
            <Typography variant="body2">{category?.name || "-"}</Typography>
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
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body2">{description}</Typography>
            </Box>
            {status === "pending" && auth.role === 3 && (
              <Box>
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
                >
                  Delete
                </Button>
              </Box>
            )}
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
    </Box>
  );
};
