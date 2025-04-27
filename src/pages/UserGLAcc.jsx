import { Add, ArrowBackIos } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getUsersWithGLAccounts } from "../libs/fetcher";
import { DataGrid } from "@mui/x-data-grid";

export default function UserGLAcc() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(
    "users-gl-accounts",
    () => getUsersWithGLAccounts()
  );

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
        console.log(value);
        return value.map((v) => v.code + " - " + v.description);
      },
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {params.value.map((v) => (
              <Typography variant="body2">{v}</Typography>
            ))}
          </Box>
        );
      },
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
        disableSelectionOnClick
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-cell": {
            py: 1, // Set padding for all cells
          },
        }}
      />
    </Box>
  );
}
