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
import { getPaymentMethods } from "../libs/fetcher";
import { useQuery } from "react-query";

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

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Description2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((account) => (
              <TableRow key={account.code}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.description || "-"}</TableCell>
                <TableCell>{account.description2 || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
