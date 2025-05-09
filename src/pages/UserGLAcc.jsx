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
import { getUsersWithGLAccounts, setUserGLAccounts } from "../libs";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { queryClient, useApp } from "../ThemedApp";

export default function UserGLAcc() {
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery(
    "users-gl-accounts",
    () => getUsersWithGLAccounts()
  );

  const updateMutation = useMutation(setUserGLAccounts, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users-gl-accounts"]);
      setGlobalMsg("GL Accounts updated successfully!");
    },
    onError: (error) => {
      setGlobalMsg(error.response.data.message, "error");
    },
  });

  const handleEdit = (user) => {
    navigate(`/gl-accounts/assign/form/${user.id}`);
  };

  const handleRemove = (user) => {
    updateMutation.mutate({
      user_id: user.id,
      gl_accounts: [], // Empty array to remove all GL accounts
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
      field: "gl_accounts",
      headerName: "GL Accounts",
      flex: 2,
      valueGetter: (value, row) => {
        return value.map((v) => v.code + " - " + v.description);
      },
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {params.value.map((v, index) => (
              <Typography variant="body2" key={`${params.row.id}-${index}`}>{v}</Typography>
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
        <Typography variant="h5">Assign GL Accounts</Typography>
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
              navigate("/gl-accounts/assign/form");
            }}
          >
            Assign
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-cell": {
            py: 1,
          },
        }}
      />
    </Box>
  );
}
