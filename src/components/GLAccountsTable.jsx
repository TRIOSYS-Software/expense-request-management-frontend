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
import { getGLAccounts } from "../libs/fetcher";
import { useQuery } from "react-query";
import { DataGrid } from "@mui/x-data-grid";

export default function GLAccountsTable() {
  const { data, isLoading, isError, error } = useQuery(
    "gl-accounts",
    getGLAccounts
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

  return (
    <DataGrid
      rows={data}
      columns={[
        { field: "dockey", headerName: "DocKey", flex: 1 },
        { field: "code", headerName: "Code", flex: 1 },
        { field: "description", headerName: "Description", flex: 2 },
      ]}
      getRowId={(row) => row.dockey}
      pageSizeOptions={[5, 10, 25, 50, 100]}
    />
  );
}
