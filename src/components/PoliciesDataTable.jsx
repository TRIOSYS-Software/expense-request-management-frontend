import { Box, Paper, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useMutation, useQuery } from "react-query";
import { deletePolicy, fetchPolicies } from "../libs";
import { Delete, Edit } from "@mui/icons-material";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";
import { render } from "react-dom";

export default function PoliciesDataTable() {
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const deleteRule = useMutation(async (id) => await deletePolicy(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("rules");
      setGlobalMsg("Rule deleted successfully!");
    },
    onError: () => {
      setGlobalMsg("Rule deletion failed!");
    },
  });

  const handleEdit = (id) => {
    navigate(`/policies/form/${id}`);
  };

  const handleDelete = (id) => {
    deleteRule.mutate(id);
  };

  const column = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "min_amount",
      headerName: "Min Amount",
      flex: 1,
    },
    { field: "max_amount", headerName: "Max Amount", flex: 1 },
    {
      field: "projects",
      headerName: "Project",
      flex: 1,
      valueGetter: (value, row) => value.description,
    },
    {
      field: "departments",
      headerName: "Department",
      flex: 1,
      valueGetter: (value, row) => value.name || "N/A",
    },
    {
      field: "policy_users",
      headerName: "Approvers",
      flex: 1,
      valueGetter: (value, row) => value,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {params.value.map((v) => {
              return (
                <Typography variant="body2">
                  {v.Approver.name + "- Level " + v.level}
                </Typography>
              );
            })}
          </Box>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      type: "actions",
      cellClassName: "actions",
      width: 130,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            material={{
              sx: {
                color: "primary.main",
              },
            }}
            onClick={() => handleEdit(id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(id)}
            material={{
              sx: {
                color: "error.main",
              },
            }}
          />,
        ];
      },
    },
  ];

  const { data, isLoading, isError, error } = useQuery("rules", fetchPolicies);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <DataGrid
        rows={data}
        columns={column}
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-cell": {
            py: 1, // Set padding for all cells
          },
        }}
      />
    </Paper>
  );
}
