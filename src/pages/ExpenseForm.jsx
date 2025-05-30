import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Grid2 as Grid,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Send, ArrowBackIos, BackHand, ArrowBack } from "@mui/icons-material";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  createExpense,
  fetchExpenseCategories,
  fetchExpenseRequestsByID,
  fetchUsers,
  getGLAccounts,
  getPaymentMethods,
  getProjects,
  getUserGLAccounts,
  getUserPaymentMethods,
  getUserProjects,
  updateExpense,
} from "../libs";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../ThemedApp";
import { useEffect } from "react";

const ExpenseForm = () => {
  const { id } = useParams();
  const { auth, setGlobalMsg } = useApp();
  const navigate = useNavigate();

  const queries = [
    {
      queryKey: "expense-categories",
      queryFn: fetchExpenseCategories,
    },
    {
      queryKey: "projects",
      queryFn: getProjects,
    },
    {
      queryKey: "users",
      queryFn: fetchUsers,
    },
    {
      queryKey: "payment-method",
      queryFn: () => getPaymentMethods(),
    },
    {
      queryKey: "glaccounts",
      queryFn: () => getGLAccounts(),
    },
    {
      queryKey: "user-payment-methods",
      queryFn: () => getUserPaymentMethods(auth.id),
    },
    {
      queryKey: "user-gl-accounts",
      queryFn: () => getUserGLAccounts(auth.id),
    },
    {
      queryKey: "user-projects",
      queryFn: () => getUserProjects(auth.id),
    },
  ];

  const results = useQueries(queries);

  const [
    expenseCategories,
    projects,
    users,
    paymentMethods,
    glAccounts,
    userPaymentMethods,
    userGLAccounts,
    userProjects,
  ] = results;

  // const approvers = users.data?.filter((user) => user.roles.id === 2);

  const { data } = useQuery(
    ["expense", id],
    () => fetchExpenseRequestsByID(id),
    {
      enabled: !!id,
    }
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      approver: [],
      project: "",
      amount: "",
      category: "",
      description: "",
      attachment: null,
      submittedDate: "",
      paymentMethod: "",
      gl_account: "",
      is_send_to_sql_acc: false,
    },
  });

  const filteredPaymentMethods = paymentMethods.data?.filter((method) => {
    return userPaymentMethods.data?.some((userMethod) => {
      return userMethod.code === method.code;
    });
  });

  const filteredGLAccounts = glAccounts.data?.filter((account) => {
    return userGLAccounts.data?.some((userAccount) => {
      return userAccount.code === account.code;
    });
  });

  const filteredProjects = projects.data?.filter((project) => {
    return userProjects.data?.some((userProject) => {
      return userProject.code === project.code;
    });
  });

  const create = useMutation(async (data) => createExpense(data), {
    onSuccess: async (data) => {
      setGlobalMsg("Expense created successfully!");
      reset();
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setError("root", { message: error.response.data });
      } else {
        setError("root", { message: error.message });
      }
    },
  });

  const update = useMutation(async (data) => updateExpense(id, data), {
    onSuccess: async (data) => {
      setGlobalMsg("Expense updated successfully!");
      navigate(-1);
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setError("root", { message: error.response.data });
      } else {
        setError("root", { message: error.message });
      }
    },
  });

  useEffect(() => {
    if (data) {
      const date = new Date(data.date_submitted).toISOString().split("T")[0];
      reset({
        amount: data.amount,
        category: data.category_id,
        description: data.description,
        project: data.project,
        submittedDate: date,
        approver: data.approvers?.split(",") || [],
        paymentMethod: data.payment_method,
        gl_account: data.gl_account,
        is_send_to_sql_acc: data.is_send_to_sql_acc,
      });
    }
  }, [data, reset]);

  const onSubmit = (data) => {
    const date = new Date(data.submittedDate);
    const formData = new FormData();
    formData.append("amount", data.amount);
    formData.append("category_id", data.category);
    formData.append("description", data.description);
    formData.append("project", data.project);
    formData.append("date_submitted", date.toISOString());
    formData.append("attachment", data.attachment);
    formData.append("user_id", auth.id);
    formData.append("payment_method", data.paymentMethod);
    formData.append("gl_account", data.gl_account);
    formData.append("is_send_to_sql_acc", data.is_send_to_sql_acc);
    if (id) {
      update.mutate(formData);
    } else {
      create.mutate(formData);
    }
  };

  if (
    expenseCategories.isLoading ||
    projects.isLoading ||
    users.isLoading ||
    paymentMethods.isLoading ||
    glAccounts.isLoading
  ) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    expenseCategories.isError ||
    projects.isError ||
    users.isError ||
    paymentMethods.isError ||
    glAccounts.isError
  ) {
    return (
      <Alert severity="error">
        "Something went wrong!",{" "}
        {expenseCategories.error?.message ||
          projects.error?.message ||
          users.error?.message ||
          paymentMethods.error?.message ||
          glAccounts.error?.message}
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Expense Form</Typography>
        </Box>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              disabled={id && data?.status === "approved"}
              label="Submitted Date"
              type="date"
              // value={submittedDate}
              slotProps={{ inputLabel: { shrink: true } }}
              // onChange={handleDateChange}
              {...register("submittedDate", {
                required: "Submitted Date is required",
              })}
              fullWidth
            />
            {errors.submittedDate && (
              <Typography variant="body2" color="error">
                {errors.submittedDate.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="project-label">Project</InputLabel>
              <Controller
                name="project"
                control={control}
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <Select
                    disabled={id && data?.status === "approved"}
                    labelId="project-label"
                    label="Project"
                    {...field}
                  >
                    <MenuItem value="">Choose an option</MenuItem>
                    {id && auth.role === 1
                      ? projects.data?.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.description}
                          </MenuItem>
                        ))
                      : filteredProjects.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.description}
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.project && (
              <Typography variant="body2" color="error">
                {errors.project.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              disabled={id && data?.status === "approved"}
              label="Amount"
              type="number"
              {...register("amount", {
                required: "Amount is required",
                validate: (value) =>
                  value > 0 || "Amount must be greater than 0",
              })}
              fullWidth
              slotProps={{
                inputLabel: { shrink: id ? true : undefined },
                input: { inputProps: { step: 0.0001 } },
              }}
            />
            {errors.amount && (
              <Typography variant="body2" color="error">
                {errors.amount.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="gl_account"
              control={control}
              rules={{ required: "GL Account is required" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  disabled={id && data?.status === "approved"}
                  options={
                    id && auth.role === 1 ? glAccounts.data : filteredGLAccounts
                  }
                  getOptionLabel={(option) =>
                    `${option.code} - ${option.description}`
                  }
                  onChange={(event, newValue) => onChange(newValue?.dockey)}
                  onBlur={onBlur}
                  value={
                    (id && auth.role === 1
                      ? glAccounts.data
                      : filteredGLAccounts
                    ).find((option) => {
                      return option.dockey == value;
                    }) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="GL Account"
                      slotProps={{
                        inputLabel: { shrink: id ? true : undefined },
                      }}
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
          </Grid>
          <Grid size={12}>
            <TextField
              disabled={id && auth.role === 1}
              label="Description"
              multiline
              rows={5}
              {...register("description", {
                required: "Description is required",
              })}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            {errors.description && (
              <Typography variant="body2" color="error">
                {errors.description.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="attachment"
              control={control}
              render={({ field }) => (
                <TextField
                  disabled={id && data?.status === "approved"}
                  type="file"
                  label="Attachment"
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { accept: "image/*, application/pdf" },
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const maxSize = 2 * 1024 * 1024; // 2 MB
                      if (file.size > maxSize) {
                        setError("attachment", {
                          type: "manual",
                          message: "File size must be less than 2 MB",
                        });
                      } else {
                        clearErrors("attachment");
                      }
                    }
                    field.onChange(file);
                  }}
                  fullWidth
                />
              )}
            />
            {errors.attachment && (
              <Typography variant="body2" color="error">
                {errors.attachment.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="payment-label">Payment Method</InputLabel>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Payment Method is required" }}
                render={({ field }) => (
                  <Select
                    labelId="payment-label"
                    label="Payment Method"
                    {...field}
                    disabled={id && data?.status === "approved"}
                  >
                    <MenuItem value="">Choose an option</MenuItem>
                    {id && auth.role === 1
                      ? glAccounts.data?.map((pm) => (
                          <MenuItem key={pm.code} value={pm.code}>
                            {pm.journal} ({pm.description})
                          </MenuItem>
                        ))
                      : filteredPaymentMethods.map((pm) => (
                          <MenuItem key={pm.code} value={pm.code}>
                            {pm.journal} ({pm.description})
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.paymentMethod && (
              <Typography variant="body2" color="error">
                {errors.paymentMethod.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {auth.role === 1 && data?.is_send_to_sql_acc && (
              <Controller
                name="is_send_to_sql_acc"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                      />
                    }
                    label="Send to SQLACC"
                    labelPlacement="start"
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
        {errors.root && (
          <Typography variant="body2" color="error">
            {errors.root.message}
          </Typography>
        )}
        <Box
          display="flex"
          justifyContent={{ xs: "space-between", md: "flex-end" }}
        >
          <Button
            sx={{ mr: 2 }}
            onClick={() => navigate("/expenses")}
            variant="contained"
            startIcon={<ArrowBackIos />}
          >
            Back
          </Button>
          <Button type="submit" variant="contained" startIcon={<Send />}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExpenseForm;
