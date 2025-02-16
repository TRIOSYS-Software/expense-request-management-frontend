import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";

const expenseRequests = [
  {
    id: 1,
    requester: "John Doe",
    amount: "$100.00",
    date: "2023-10-01",
    status: "Approved",
  },
  {
    id: 2,
    requester: "Jane Smith",
    amount: "$250.00",
    date: "2023-10-02",
    status: "Pending",
  },
  {
    id: 3,
    requester: "Alice Johnson",
    amount: "$75.00",
    date: "2023-10-03",
    status: "Rejected",
  },
  {
    id: 4,
    requester: "Bob Brown",
    amount: "$150.00",
    date: "2023-10-04",
    status: "Approved",
  },
  {
    id: 5,
    requester: "Charlie Davis",
    amount: "$200.00",
    date: "2023-10-05",
    status: "Pending",
  },
  {
    id: 6,
    requester: "Diana Evans",
    amount: "$300.00",
    date: "2023-10-06",
    status: "Approved",
  },
  {
    id: 7,
    requester: "Eve Foster",
    amount: "$400.00",
    date: "2023-10-07",
    status: "Pending",
  },
  {
    id: 8,
    requester: "Frank Green",
    amount: "$500.00",
    date: "2023-10-08",
    status: "Rejected",
  },
  {
    id: 9,
    requester: "Grace Harris",
    amount: "$600.00",
    date: "2023-10-09",
    status: "Approved",
  },
  {
    id: 10,
    requester: "Henry Irving",
    amount: "$700.00",
    date: "2023-10-10",
    status: "Pending",
  },
  {
    id: 11,
    requester: "Ivy Johnson",
    amount: "$800.00",
    date: "2023-10-11",
    status: "Rejected",
  },
  {
    id: 12,
    requester: "Jack King",
    amount: "$900.00",
    date: "2023-10-12",
    status: "Approved",
  },
  {
    id: 13,
    requester: "Karen Lee",
    amount: "$1000.00",
    date: "2023-10-13",
    status: "Pending",
  },
  {
    id: 14,
    requester: "Leo Martin",
    amount: "$1100.00",
    date: "2023-10-14",
    status: "Rejected",
  },
  {
    id: 15,
    requester: "Mona Nelson",
    amount: "$1200.00",
    date: "2023-10-15",
    status: "Approved",
  },
];

const App = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        request.status === "Approved"
                          ? "green"
                          : request.status === "Pending"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {request.status}
                  </TableCell>
                  <TableCell>
                    <Button color="primary">View</Button>
                    <Button color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={expenseRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default App;
