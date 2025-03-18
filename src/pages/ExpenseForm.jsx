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
} from "@mui/material";
import { Send, ArrowBackIos, BackHand, ArrowBack } from "@mui/icons-material";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  createExpense,
  fetchExpenseCategories,
  fetchExpenseRequestsByID,
  fetchUsers,
  getLowLevelGLAccounts,
  getPaymentMethods,
  getProjects,
  updateExpense,
} from "../libs/fetcher";
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
      queryFn: () => getLowLevelGLAccounts(),
    },
  ];

  const results = useQueries(queries);

  const [expenseCategories, projects, users, paymentMethods, glAccounts] =
    results;

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
    },
  });

  const create = useMutation(async (data) => createExpense(data), {
    onSuccess: async (data) => {
      setGlobalMsg("Expense created successfully!");
      reset();
    },
    onError: (error) => {
      setError("root", {
        message: error.message,
      });
    },
  });

  const update = useMutation(async (data) => updateExpense(id, data), {
    onSuccess: async (data) => {
      setGlobalMsg("Expense updated successfully!");
      navigate(-1);
    },
    onError: (error) => {
      setError("root", {
        message: error.message,
      });
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
      });
    }
  }, [data]);

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
    console.log(data.attachment);
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
                  <Select labelId="project-label" label="Project" {...field}>
                    <MenuItem value="">Choose an option</MenuItem>
                    {projects.data.map((option) => (
                      <MenuItem key={option.CODE} value={option.CODE}>
                        {option.DESCRIPTION}
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
              label="Amount"
              type="number"
              {...register("amount", {
                required: "Amount is required",
                validate: (value) =>
                  value > 0 || "Amount must be greater than 0",
              })}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
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
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select labelId="category-label" label="Category" {...field}>
                    <MenuItem value="">Choose an option</MenuItem>
                    {expenseCategories.data.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.category && (
              <Typography variant="body2" color="error">
                {errors.category.message}
              </Typography>
            )}
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel id="gl-account-label">GL Account</InputLabel>
              <Controller
                name="gl_account"
                control={control}
                rules={{ required: "gl_account is required" }}
                render={({ field }) => (
                  <Select
                    labelId="gl-account-label"
                    label="GL Account"
                    {...field}
                  >
                    <MenuItem value="">Choose an option</MenuItem>
                    {glAccounts.data.map((option) => (
                      <MenuItem key={option.DOCKEY} value={option.CODE}>
                        {option.DESCRIPTION}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.gl_account && (
              <Typography variant="body2" color="error">
                {errors.gl_account.message}
              </Typography>
            )}
          </Grid>
          <Grid size={12}>
            <TextField
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
          <Grid size={6}>
            <Controller
              name="attachment"
              control={control}
              render={({ field }) => (
                <TextField
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
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel id="payment-label">Payment Method</InputLabel>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Payment Method is required" }}
                render={({ field }) => (
                  <Select
                    labelId="project-label"
                    label="Payment Method"
                    {...field}
                  >
                    <MenuItem value="">Choose an option</MenuItem>
                    {paymentMethods.data.map((pm) => (
                      <MenuItem key={pm.CODE} value={pm.CODE}>
                        {pm.JOURNAL} ({pm.DESCRIPTION})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
          {/* <Grid size={12}>
            <Controller
              name="approver"
              control={control}
              rules={{
                validate: (value) => {
                  if (value.length > 3) {
                    return "Only Select 3 Approvers.";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-chip-label">
                    Approvers (optional)
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    {...field}
                    input={<OutlinedInput label="Approvers (optional)" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const label = approvers.find(
                            (a) => a.id === value
                          ).name;
                          return <Chip key={value} label={label} />;
                        })}
                      </Box>
                    )}
                  >
                    {approvers.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} ({option.departments.name})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select up to 3 people to approve the expense. order matters!
                  </FormHelperText>
                </FormControl>
              )}
            />
            {errors.approver && (
              <Typography variant="body2" color="error">
                {errors.approver.message}
              </Typography>
            )}
          </Grid> */}
        </Grid>
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
