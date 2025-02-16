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
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Send, ArrowBackIos } from "@mui/icons-material";
import { useQueries, useQuery } from "react-query";
import { fetchExpenseCategories, getProjects } from "../libs/fetcher";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

const ExpenseForm = () => {
  const { setGlobalMsg } = useApp();
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
  ];

  const results = useQueries(queries);

  const [expenseCategories, projects] = results;

  const {
    register,
    control,
    handleSubmit,
    setError,
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
    },
  });

  const approversValue = [
    { id: 1, name: "Approver 1" },
    { id: 2, name: "Approver 2" },
    { id: 3, name: "Approver 3" },
  ];

  if (expenseCategories.isLoading || projects.isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (expenseCategories.isError || projects.isError) {
    return (
      <Alert severity="error">
        "Something went wrong!",{" "}
        {expenseCategories.error.message || projects.error.message}
      </Alert>
    );
  }

  const onSubmit = (data) => {
    console.log({ data });
    setGlobalMsg("Expense created successfully!");
    reset();
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: "md", mx: "auto" }}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">Expense Form</Typography>
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
                // rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select labelId="category-label" label="Category" {...field}>
                    <MenuItem value="">Choose an option</MenuItem>
                    {expenseCategories.data.map((option) => (
                      <MenuItem key={option.id} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
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
            />
            {errors.description && (
              <Typography variant="body2" color="error">
                {errors.description.message}
              </Typography>
            )}
          </Grid>
          <Grid size={12}>
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
                  onChange={(e) => field.onChange(e.target.files[0])}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Controller
              name="approver"
              control={control}
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
                          const label = approversValue.find(
                            (a) => a.id === value
                          ).name;
                          return <Chip key={value} label={label} />;
                        })}
                      </Box>
                    )}
                  >
                    {approversValue.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
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
