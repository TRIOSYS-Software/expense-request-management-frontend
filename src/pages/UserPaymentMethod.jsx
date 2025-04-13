import { Add, ArrowBackIos } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { getUsersWithPaymentMethods } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";

export default function UserPaymentMethod() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(
    "users-payment-methods",
    getUsersWithPaymentMethods
  );

  //   if (isLoading) {
  //     return (
  //       <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
  //         <CircularProgress />
  //       </Box>
  //     );
  //   }

  //   if (isError) {
  //     return (
  //       <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
  //         <Alert severity="error">{error.message}</Alert>
  //       </Box>
  //     );
  //   }

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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Users</TableCell>
                <TableCell>Payment Methods</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {user.payment_methods.map((method) => (
                        <Chip
                          label={`${method.code} (${method.description})`}
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
