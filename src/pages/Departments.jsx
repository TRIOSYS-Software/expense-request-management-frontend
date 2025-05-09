import { Add } from "@mui/icons-material";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DepartmentsTable from "../components/DepartmentsTable";
import { queryClient, useApp } from "../ThemedApp";
import { useMutation } from "react-query";
import { createDepartment } from "../libs";

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

export default function Departments() {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState("");

  const { setGlobalMsg } = useApp();

  const create = useMutation(
    async (department) => await createDepartment(department),
    {
      onSuccess: () => {
        setGlobalMsg("Department created successfully!");
        queryClient.invalidateQueries("departments");
      },
      onError: () => {
        setGlobalMsg("Department creation failed!");
      },
    }
  );

  const handleClick = () => {
    create.mutate({ name: department });
    setDepartment("");
    setOpen(false);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 } }}>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">Departments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Typography variant="h6">Add Department</Typography>
          <TextField
            label="Department Name"
            variant="outlined"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
            fullWidth
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClick} variant="contained">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      <DepartmentsTable />
    </Box>
  );
}
