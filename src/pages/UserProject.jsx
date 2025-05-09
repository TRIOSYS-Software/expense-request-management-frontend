import { Add, ArrowBackIos, Edit, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { getUsersWithProjects, setUserProjects } from "../libs";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { queryClient, useApp } from "../ThemedApp";
import { useState } from "react";

export default function UserProject() {
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery(
    "users-projects",
    getUsersWithProjects
  );

  const updateMutation = useMutation(setUserProjects, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users-projects"]);
      setGlobalMsg("Projects updated successfully!");
    },
    onError: (error) => {
      setGlobalMsg(error.response.data.message, "error");
    },
  });

  const handleEdit = (user) => {
    navigate(`/projects/assign/form/${user.id}`);
  };

  const handleRemove = (user) => {
    updateMutation.mutate({
      user_id: user.id,
      projects: [], // Empty array to remove all projects
    });
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

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "projects",
      headerName: "Projects",
      flex: 2,
      valueGetter: (value, row) =>
        value.map((v) => `${v.code} (${v.description})`),
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {params.value.map((v, index) => (
              <Typography key={`${params.row.id}-${index}`} variant="body2">
                {v}
              </Typography>
            ))}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleRemove(params.row)}
            size="small"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Assign Projects</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIos />}
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ display: "flex" }}
            onClick={() => {
              navigate("/projects/assign/form");
            }}
          >
            Assign
          </Button>
        </Box>
      </Box>
      <Box>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          // getRowId={(row) => row.id}
          rowsPerPageOptions={[5]}
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              py: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
}
