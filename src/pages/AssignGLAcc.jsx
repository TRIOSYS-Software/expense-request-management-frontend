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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  fetchUsersByRole,
  getGLAccounts,
  setUserGLAccounts,
} from "../libs/fetcher";
import { useMutation, useQueries } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";

export default function AssignGLAcc() {
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
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

  const create = useMutation(async (data) => await setUserGLAccounts(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setGlobalMsg("GL Accounts assigned successfully!");
      reset();
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
        <Typography variant="h5">AssignGLAcc</Typography>
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
            {errors.gl_account && (
              <Typography variant="body2" color="error">
                {errors.gl_account.message}
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
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
