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
import { getProjects } from "../libs/fetcher";
import { useQuery } from "react-query";
import { DataGrid } from "@mui/x-data-grid";

export default function ProjectsTable() {
  const { data, isLoading, isError, error } = useQuery("projects", getProjects);
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
      {/* <TableContainer>
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
      </TableContainer> */}
      <DataGrid getRowId={(row) => row.code} rows={data} columns={column} />
    </Paper>
  );
}
