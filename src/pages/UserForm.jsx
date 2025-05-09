import {
  Box,
  Grid2 as Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import { ArrowBackIos, Send } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  fetchDeparments,
  fetchRoles,
  createUser,
  fetchUserById,
  updateUser,
} from "../libs";
import { useApp } from "../ThemedApp";
import { data, useNavigate, useParams } from "react-router-dom";
import { use, useEffect } from "react";

function UserForm() {
  const { id } = useParams();
  const { globalMsg, setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery(
    ["user", id],
    () => fetchUserById(id),
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const queries = [
    {
      queryKey: "roles",
      queryFn: fetchRoles,
    },
    {
      queryKey: "departments",
      queryFn: fetchDeparments,
    },
  ];

  const results = useQueries(queries);

  const [roles, departments] = results;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      role: "",
      department: "",
    },
  });

  const create = useMutation(async (data) => createUser(data), {
    onSuccess: async (data) => {
      setGlobalMsg("User created successfully!");
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const update = useMutation(async (data) => updateUser(id, data), {
    onSuccess: async (data) => {
      setGlobalMsg("User updated successfully!");
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const onSubmit = (data) => {
    if (id) {
      update.mutate(data);
      navigate("/users");
    } else {
      create.mutate(data);
    }
    reset();
  };

  if (roles.isLoading || departments.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (roles.isError || departments.isError) {
    return (
      <Alert severity="error">
        "Something went wrong!",{" "}
        {roles.error.message || departments.error.message}
      </Alert>
    );
  }

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: "md", mx: "auto" }}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">User Form</Typography>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("name", {
                required: "Name is required!",
                maxLength: {
                  value: 50,
                  message: "Name must be at most 50 characters",
                },
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              slotProps={id && { inputLabel: { shrink: true } }}
              label="Name"
              // slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            {errors.name && (
              <Typography variant="caption" color="error">
                {errors.name.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "invalid email address",
                },
              })}
              label="Email"
              slotProps={id && { inputLabel: { shrink: true } }}
              fullWidth
            />
            {errors.email && (
              <Typography variant="caption" color="error">
                {errors.email.message}
              </Typography>
            )}
          </Grid>
          <Grid size={12}>
            <TextField
              {...register("password", {
                required: id ? false : "Password is required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              label="Password"
              fullWidth
            />
            {errors.password && (
              <Typography variant="caption" color="error">
                {errors.password.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required!" }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="role">Role</InputLabel>
                  <Select labelId="role" {...field} label="role">
                    <MenuItem value={""}>choose roles</MenuItem>
                    {roles.data.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.role && (
              <Typography variant="caption" color="error">
                {errors.role.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required!" }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="department">Department</InputLabel>
                  <Select labelId="department" {...field} label="department">
                    <MenuItem value={""}>choose deparment</MenuItem>
                    {departments.data.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.department && (
              <Typography variant="caption" color="error">
                {errors.department.message}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent={{ xs: "space-between", md: "flex-end" }}
        >
          <Button
            sx={{ mr: 2 }}
            onClick={() => navigate("/users")}
            variant="contained"
            startIcon={<ArrowBackIos />}
          >
            Back
          </Button>
          <Button type="submit" variant="contained" startIcon={<Send />}>
            {data ? "Update" : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default UserForm;
