import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";

import { useQuery } from "react-query";
import {
  fetchPolicies,
  deletePolicy,
  fetchExpenseCategoryById,
} from "../libs/fetcher";
import { Delete, Edit } from "@mui/icons-material";
import { useApp } from "../ThemedApp";
import { useEffect } from "react";

export function PoliciesTable() {
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery("rules", fetchPolicies);

  console.log(data);

  const AsyncCategoryName = ({ id }) => {
    const { data: category } = useQuery(
      `category-${id}`,
      () => fetchExpenseCategoryById(id),
      {
        enabled: !!id,
      }
    );

    return category ? <span>{category.name}</span> : <CircularProgress />;
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Condition Type</TableCell>
              <TableCell>Condition Value</TableCell>
              <TableCell>Approver Roles</TableCell>
              <TableCell>For Department</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((rule, index) => (
              <TableRow key={index}>
                <TableCell>{rule.id}</TableCell>
                <TableCell>{rule.condition_type}</TableCell>
                <TableCell>
                  {rule.condition_type === "category" ? (
                    <AsyncCategoryName id={rule.condition_value} />
                  ) : (
                    rule.condition_value
                  )}
                </TableCell>
                <TableCell>
                  {rule.approvers.map((approver, index) => (
                    <Chip key={index} label={approver.name} sx={{ mr: 1 }} />
                  ))}
                </TableCell>
                <TableCell>{rule.departments.name || "-"}</TableCell>
                <TableCell>{rule.priority}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      deletePolicy(rule.id);
                      setGlobalMsg("Policy deleted successfully");
                      window.location.reload();
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PoliciesTable;
