import { Box, CircularProgress, Alert } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { deleteUser, fetchUsers } from "../libs/fetcher";
import { Delete, Edit, Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { queryClient, useApp } from "../ThemedApp";

function UsersTable() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery("users", fetchUsers);
  const { setGlobalMsg, auth } = useApp();

  const handleEdit = (id) => {
    navigate(`/users/form/${id}`);
  };

  const deleteUsr = useMutation(async (id) => await deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setGlobalMsg("User deleted successfully!");
    },
    onError: () => {
      setGlobalMsg("User deletion failed!");
    },
  });

  const handleDelete = (id) => {
    deleteUsr.mutate(id);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">"Something went wrong!", {error.message}</Alert>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "roles",
      headerName: "Role",
      flex: 1,
      valueGetter: (value, row) => value?.name || "N/A",
    },
    {
      field: "departments",
      headerName: "Department",
      flex: 1,
      valueGetter: (value, row) => value?.name || "N/A",
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
            disabled={auth.id === id}
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

  return (
    <Box>
      <DataGrid
        rows={data}
        columns={columns}
        sx={{
          "& .MuiDataGrid-cell": {
            py: 1, // Set padding for all cells
          },
        }}
        getRowHeight={() => "auto"}
      />
    </Box>
  );
}

export default UsersTable;
