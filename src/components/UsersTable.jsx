import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchUsers } from "../libs/fetcher";
import { Delete, Edit, Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

function UsersTable() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery("users", fetchUsers);

  const [search, setSearch] = useState("");

  let filterdUsers = [];
  if (search.includes("dept:")) {
    const departmentName = search.split("dept: ")[1];
    console.log(departmentName);
    filterdUsers = data.filter((user) => {
      return user.departments.name
        ?.toLowerCase()
        .includes(departmentName?.toLowerCase());
    });
    console.log(filterdUsers);
  } else if (search.includes("role:")) {
    const roleName = search.split("role: ")[1];
    filterdUsers = data.filter((user) => {
      return user.roles.name?.toLowerCase().includes(roleName?.toLowerCase());
    });
  } else {
    filterdUsers = data?.filter((user) => {
      return user.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  console.log(filterdUsers);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">"Something went wrong!", {error.message}</Alert>
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "roles",
      headerName: "Role",
      flex: 1,
      valueGetter: (value, row) => value?.name || "N/A",
    },
    {
      field: "departments",
      headerName: "Department",
      flex: 1,
      valueGetter: (value, row) => value?.name || "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      type: "actions",
      cellClassName: "actions",
      width: 130,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            material={{
              sx: {
                color: "primary.main",
              },
            }}
            onClick={() => handleEdit(id)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDelete(id)}
            material={{
              sx: {
                color: "error.main",
              },
            }}
          />,
        ];
      },
    },
  ];

  return (
    <Box>
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Search"
          size="small"
          sx={{ mb: 2, width: { xs: "100%", md: "auto" } }}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          helperText='add "dept:/role:" to search by department or role'
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box> */}
      {filterdUsers?.length > 0 ? (
        // <TableContainer component={Paper}>
        //   <Table>
        //     <TableHead>
        //       <TableRow>
        //         <TableCell>ID</TableCell>
        //         <TableCell>Name</TableCell>
        //         <TableCell>Email</TableCell>
        //         <TableCell>Role</TableCell>
        //         <TableCell>Department</TableCell>
        //         <TableCell>Actions</TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {filterdUsers.map((user, index) => (
        //         <TableRow key={index}>
        //           <TableCell>{user.id}</TableCell>
        //           <TableCell>{user.name}</TableCell>
        //           <TableCell>{user.email}</TableCell>
        //           <TableCell>{user.roles?.name}</TableCell>
        //           <TableCell>{user.departments?.name || "-"}</TableCell>
        //           <TableCell>
        //             <IconButton
        //               color="primary"
        //               onClick={() => {
        //                 navigate(`/users/form/${user.id}`);
        //               }}
        //             >
        //               <Edit />
        //             </IconButton>
        //             <IconButton color="primary" onClick={() => {}}>
        //               <Delete />
        //             </IconButton>
        //           </TableCell>
        //         </TableRow>
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
        <DataGrid
          rows={filterdUsers}
          columns={columns}
          sx={{
            "& .MuiDataGrid-cell": {
              py: 1, // Set padding for all cells
            },
          }}
          getRowHeight={() => "auto"}
        />
      ) : (
        <Alert severity="info">No users found</Alert>
      )}
    </Box>
  );
}

export default UsersTable;
