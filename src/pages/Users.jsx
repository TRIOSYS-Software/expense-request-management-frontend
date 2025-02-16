import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UsersTable from "../components/UsersTable";

function Users() {
  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2 }}>
      <Box
        sx={{
          py: 2,
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "start",
          direction: "row",
          display: "flex",
        }}
      >
        <Typography variant="h5">Users Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ display: { xs: "none", md: "flex" } }}
          onClick={() => {
            navigate("/users/form");
          }}
        >
          Add User
        </Button>
        <Button
          variant="contained"
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            navigate("/users/form");
          }}
        >
          Add
        </Button>
      </Box>
      <UsersTable />
    </Box>
  );
}

export default Users;
