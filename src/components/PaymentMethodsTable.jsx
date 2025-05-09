import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getPaymentMethods } from "../libs";
import { useQuery } from "react-query";
import { DataGrid } from "@mui/x-data-grid";

export default function PaymentMethodsTable() {
  const { data, isLoading, isError, error } = useQuery(
    "payment-methods",
    getPaymentMethods
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

  const column = [
    { field: "code", headerName: "Code", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "description2",
      headerName: "Description2",
      flex: 2,
      valueGetter: (value, row) => row.description2 || "N/A",
    },
  ];

  return <DataGrid rows={data} columns={column} getRowId={(row) => row.code} />;
}
