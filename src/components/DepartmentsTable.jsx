import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchDeparments,
  deleteDepartment,
  updateDepartment,
} from "../libs/fetcher";
import { useMutation, useQuery } from "react-query";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { queryClient, useApp } from "../ThemedApp";

export default function DepartmentsTable() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState({});
  const { setGlobalMsg } = useApp();
  const { data, isLoading, isError, error } = useQuery(
    "departments",
    fetchDeparments
  );

  const deleteDept = useMutation(async (id) => await deleteDepartment(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("departments");
      setGlobalMsg("Department deleted successfully!");
    },
    onError: () => {
      setGlobalMsg("Department deletion failed!");
    },
  });

  const updateDept = useMutation(
    async (name) => await updateDepartment(department.id, { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
        setGlobalMsg("Department updated successfully!");
      },
      onError: () => {
        setGlobalMsg("Department update failed!");
      },
    }
  );

  const handleClick = () => {
    if (department.name) {
      updateDept.mutate(department.name);
    } else {
      setGlobalMsg("Department name is required!");
    }
    setOpen(false);
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setDepartment(department);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => deleteDept.mutate(department.id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box
          sx={{
            width: "20%",
            p: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <Typography variant="h5">Edit Department</Typography>
          <TextField
            label="Department Name"
            fullWidth
            onChange={(e) =>
              setDepartment({ ...department, name: e.target.value })
            }
            sx={{ mt: 2 }}
            defaultValue={department.name}
            variant="outlined"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" onClick={handleClick}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
