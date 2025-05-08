import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  fetchUsersByRole,
  getGLAccounts,
  getUserGLAccounts,
  setUserGLAccounts,
} from "../libs/fetcher";
import { useMutation, useQueries, useQuery } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AssignGLAcc() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setGlobalMsg } = useApp();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      user: "",
      gl_accounts: [],
    },
  });

  const queries = [
    {
      queryKey: "users",
      queryFn: () => fetchUsersByRole(3),
    },
    {
      queryKey: "glaccounts",
      queryFn: () => getGLAccounts(),
    },
  ];
  const results = useQueries(queries);

  const [users, glaccounts] = results;

  // If editing, fetch user's current GL accounts
  const { data: userGLAccounts } = useQuery(
    ["user-gl-accounts", id],
    () => getUserGLAccounts(id),
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (id) {
      setValue("user", id);
      if (userGLAccounts) {
        setValue(
          "gl_accounts",
          userGLAccounts.map((acc) => acc.dockey)
        );
      }
    }
  }, [id, userGLAccounts, setValue]);

  const create = useMutation(setUserGLAccounts, {
    onSuccess: () => {
      setGlobalMsg("GL Accounts assigned successfully!");
      reset();
      queryClient.invalidateQueries(["users-gl-accounts"]);
      if (id) {
        queryClient.invalidateQueries(["user-gl-accounts", id]);
      }
      navigate(-1);
    },
    onError: (error) => {
      setGlobalMsg(error.response.data.message, "error");
    },
  });

  const onSubmit = (data) => {
    const request = {
      user_id: parseInt(data.user),
      gl_accounts: data.gl_accounts,
    };
    create.mutate(request);
  };

  if (users.isLoading || glaccounts.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.isError || glaccounts.isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">
          {users.error.message || glaccounts.error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: "md", mx: "auto" }}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">
          {id ? "Edit User GL Accounts" : "Assign GL Accounts"}
        </Typography>
        <Grid2 container spacing={2} sx={{ my: 2 }}>
          <Grid2 size={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="user-select-label">User</InputLabel>
              <Controller
                name="user"
                control={control}
                rules={{
                  required: "User is required!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    labelId="user-select-label"
                    id="user-select"
                    label="User"
                    disabled={!!id}
                  >
                    <MenuItem value={""}>None</MenuItem>
                    {users.data.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.user && (
              <Typography color="error">{errors.user.message}</Typography>
            )}
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="gl_accounts"
              control={control}
              rules={{ required: "GL Account is required" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  multiple
                  options={glaccounts.data}
                  getOptionLabel={(option) =>
                    `${option.code} - ${option.description}`
                  }
                  onChange={(event, newValue) => {
                    onChange(newValue.map((v) => v.dockey));
                  }}
                  onBlur={onBlur}
                  value={glaccounts.data.filter((glaccount) =>
                    value.includes(glaccount.dockey)
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="GL Account"
                      slotProps={{ inputLabel: { shrink: true } }}
                      inputRef={ref}
                    />
                  )}
                />
              )}
            />
            {errors.gl_accounts && (
              <Typography variant="body2" color="error">
                {errors.gl_accounts.message}
              </Typography>
            )}
          </Grid2>
        </Grid2>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate(-1);
            }}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            {id ? "Update" : "Submit"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
