import { Add } from "@mui/icons-material";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CategoriesTable from "../components/CategoriesTable";
import { useMutation } from "react-query";
import { createExpenseCategory } from "../libs/fetcher";
import { queryClient, useApp } from "../ThemedApp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Categories() {
  const [category, setCategory] = useState("");
  const { setGlobalMsg } = useApp();
  const create = useMutation(
    async (category) => await createExpenseCategory(category),
    {
      onSuccess: () => {
        setGlobalMsg("Category created successfully!");
        queryClient.invalidateQueries("categories");
      },
      onError: () => {
        setGlobalMsg("Category creation failed!");
      },
    }
  );

  const onClick = () => {
    create.mutate({ name: category });
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ px: { xs: 2, md: 4 } }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add Category
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Typography variant="h6">Add Category</Typography>
          <TextField
            label="Category Name"
            variant="outlined"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            fullWidth
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClick} variant="contained">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      <CategoriesTable />
    </Box>
  );
}
