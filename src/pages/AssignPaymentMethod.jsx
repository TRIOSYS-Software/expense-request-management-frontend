import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  getUsers,
  getPaymentMethods,
  getUserPaymentMethods,
  setUserPaymentMethod,
} from "../libs";
import { useMutation, useQueries, useQuery } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AssignPaymentMethod() {
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
      payment_methods: [],
    },
  });

  const queries = [
    {
      queryKey: "users",
      queryFn: () => getUsers(3),
    },
    {
      queryKey: "payment-methods",
      queryFn: () => getPaymentMethods(),
    },
  ];

  const results = useQueries(queries);
  const [users, paymentMethods] = results;

  // If editing, fetch user's current payment methods
  const { data: userPaymentMethods } = useQuery(
    ["user-payment-methods", id],
    () => getUserPaymentMethods(id),
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (id) {
      setValue("user", id);
      if (userPaymentMethods) {
        setValue(
          "payment_methods",
          userPaymentMethods.map((pm) => pm.code)
        );
      }
    }
  }, [id, userPaymentMethods, setValue]);

  const create = useMutation(setUserPaymentMethod, {
    onSuccess: () => {
      setGlobalMsg("Payment methods assigned successfully!");
      reset();
      queryClient.invalidateQueries(["users-payment-methods"]);
      if (id) {
        queryClient.invalidateQueries(["user-payment-methods", id]);
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
      payment_methods: data.payment_methods,
    };
    create.mutate(request);
  };

  if (users.isLoading || paymentMethods.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.isError || paymentMethods.isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">
          {users.error.message || paymentMethods.error.message}
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
          {id ? "Edit User Payment Methods" : "Assign Payment Methods"}
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="payment-method-select-label">
                Payment Method
              </InputLabel>
              <Controller
                name="payment_methods"
                control={control}
                rules={{
                  required: "Payment Method is required!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    labelId="payment-method-select-label"
                    id="payment-method-select"
                    label="Payment Method"
                    multiple
                    input={<OutlinedInput label="Payment Method" />}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {paymentMethods.data.map((paymentMethod) => (
                      <MenuItem
                        key={paymentMethod.code}
                        value={paymentMethod.code}
                      >
                        {paymentMethod.description}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.payment_methods && (
              <Typography color="error">
                {errors.payment_methods.message}
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
