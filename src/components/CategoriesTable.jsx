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
import { useMutation, useQuery } from "react-query";
import {
  deleteExpenseCategory,
  fetchExpenseCategories,
  updateExpenseCategory,
} from "../libs";
import { Delete, Edit } from "@mui/icons-material";
import { queryClient, useApp } from "../ThemedApp";
import { useState } from "react";
import { set } from "react-hook-form";

export default function CategoriesTable() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const { setGlobalMsg } = useApp();
  const deleteCategory = useMutation(
    async (id) => await deleteExpenseCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setGlobalMsg("Category deleted successfully!");
      },
      onError: () => {
        setGlobalMsg("Category deletion failed!");
      },
    }
  );
  const { data, isLoading, isError, error } = useQuery(
    "categories",
    fetchExpenseCategories
  );

  const updateCategory = useMutation(
    async (name) => await updateExpenseCategory(category.id, { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setGlobalMsg("Category updated successfully!");
      },
      onError: () => {
        setGlobalMsg("Category updation failed!");
      },
    }
  );

  const handleClick = () => {
    if (categoryName) {
      updateCategory.mutate(categoryName);
    } else {
      setGlobalMsg("Category name is required!");
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
            {data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                      setCategory(category);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteCategory.mutate(category.id)}
                  >
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
          <Typography variant="h5">Edit Category</Typography>
          <TextField
            label="Category Name"
            fullWidth
            defaultValue={category.name}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mt: 2 }}
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
