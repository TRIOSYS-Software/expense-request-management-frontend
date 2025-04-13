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

import { useMutation, useQuery } from "react-query";
import {
  fetchPolicies,
  deletePolicy,
  fetchExpenseCategoryById,
} from "../libs/fetcher";
import { Delete, Edit } from "@mui/icons-material";
import { queryClient, useApp } from "../ThemedApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PoliciesTable() {
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery("rules", fetchPolicies);

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

  const deleteRule = useMutation(async (id) => await deletePolicy(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("rules");
      setGlobalMsg("Rule deleted successfully!");
    },
    onError: () => {
      setGlobalMsg("Rule deletion failed!");
    },
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
              <TableCell>Min Amount</TableCell>
              <TableCell>Max Amount</TableCell>
              <TableCell>Approvers</TableCell>
              <TableCell>For Department</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((rule, index) => (
              <TableRow key={index}>
                <TableCell>{rule.id}</TableCell>
                <TableCell>{rule.min_amount}</TableCell>
                <TableCell>{rule.max_amount}</TableCell>
                <TableCell>
                  {rule.policy_users.map((approver, index) => (
                    <Chip
                      key={index}
                      label={approver.Approver.name}
                      sx={{ mr: 1 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{rule.departments.name || "-"}</TableCell>
                <TableCell>{rule.projects.description}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      navigate(`/policies/form/${rule.id}`);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      deleteRule.mutate(rule.id);
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
