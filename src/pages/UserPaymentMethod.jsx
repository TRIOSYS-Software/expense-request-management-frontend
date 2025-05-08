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
import { getUsersWithPaymentMethods, setUserPaymentMethod } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { queryClient, useApp } from "../ThemedApp";

export default function UserPaymentMethod() {
  const navigate = useNavigate();
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery(
    "users-payment-methods",
    getUsersWithPaymentMethods
  );

  const updateMutation = useMutation(setUserPaymentMethod, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users-payment-methods"]);
      setGlobalMsg("Payment methods updated successfully!");
    },
    onError: (error) => {
      setGlobalMsg(error.response.data.message, "error");
    },
  });

  const handleEdit = (user) => {
    navigate(`/payment-methods/assign/form/${user.id}`);
  };

  const handleRemove = (user) => {
    updateMutation.mutate({
      user_id: user.id,
      payment_methods: [], // Empty array to remove all payment methods
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
      field: "payment_methods",
      headerName: "Payment Methods",
      flex: 2,
      valueGetter: (value, row) =>
        value.map((v) => `${v.code} (${v.description})`),
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
        <Typography variant="h5">Assign Payment Method</Typography>
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
              navigate("/payment-methods/assign/form");
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
          rowsPerPageOptions={[5]}
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              py: 1, // Set padding for all cells
            },
          }}
        />
      </Box>
    </Box>
  );
}
