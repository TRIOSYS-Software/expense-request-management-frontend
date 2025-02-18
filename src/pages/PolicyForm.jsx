import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  OutlinedInput,
  Chip,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  createPolicy,
  fetchDeparments,
  fetchExpenseCategories,
  fetchRoles,
  getProjects,
} from "../libs/fetcher";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowBackIos, Send } from "@mui/icons-material";
import { useApp } from "../ThemedApp";

function PolicyForm() {
  const { setGlobalMsg } = useApp();
  const queries = [
    {
      queryKey: "roles",
      queryFn: fetchRoles,
    },
    {
      queryKey: "departments",
      queryFn: fetchDeparments,
    },
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

  const [roles, departments, expenseCategories, projects] = results;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      roles: [],
      department: "",
      conditionType: "amount",
      conditionValue: "",
      project: "",
    },
  });

  const create = useMutation(async (data) => createPolicy(data), {
    onSuccess: (data) => {
      setGlobalMsg("Policy created successfully!");
      reset();
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const onSubmit = (data) => {
    const request = {
      condition_type: data.conditionType,
      condition_value: data.conditionValue,
      department: data.department || null,
      priority: parseInt(data.priority),
      approver_roles: data.roles.map((r) => {
        return { id: r };
      }),
    };
    create.mutate(request);
  };

  const watchedField = useWatch({
    control,
    name: "conditionType",
    defaultValue: "amount",
  });

  if (
    roles.isLoading ||
    departments.isLoading ||
    expenseCategories.isLoading ||
    projects.isLoading
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (
    roles.isError ||
    departments.isError ||
    expenseCategories.isError ||
    projects.isError
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">{roles.error || departments.error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ maxWidth: "md", mx: "auto" }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">Policy Form</Typography>
        <Grid2 container spacing={2} sx={{ my: 2 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              name="conditionType"
              control={control}
              rules={{ required: "Condition Type is required!" }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="cd-type">Condition Type</InputLabel>
                  <Select
                    labelId="cd-type"
                    id="cd-type"
                    label="Condition Type"
                    {...field}
                  >
                    <MenuItem value={"category"}>Category</MenuItem>
                    <MenuItem value={"amount"}>Amount</MenuItem>
                    <MenuItem value={"project"}>Project</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            {errors.conditionType && (
              <Typography variant="caption" color="error">
                {errors.conditionType.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            {watchedField && (
              <Controller
                name="conditionValue"
                control={control}
                rules={{
                  required: `condition value is required!`,
                  validate: (value) => {
                    if (watchedField === "amount") {
                      const pattern = /^[<=|>=|<|>]{1,2}\s{1}\d+/;
                      return pattern.test(value) || "Invalid amount format";
                    }
                    return true;
                  },
                }}
                render={({ field }) => {
                  switch (watchedField) {
                    case "category":
                      return (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="category">Category</InputLabel>
                          <Select
                            labelId="category"
                            {...field}
                            label="category"
                          >
                            <MenuItem value={""}>choose category</MenuItem>
                            {expenseCategories.data.map((dept) => (
                              <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    case "project":
                      return (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="project">Project</InputLabel>
                          <Select labelId="project" {...field} label="project">
                            <MenuItem value={""}>choose project</MenuItem>
                            {projects.data.map((project) => (
                              <MenuItem key={project.CODE} value={project.CODE}>
                                {project.DESCRIPTION}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    case "amount":
                    default:
                      return (
                        <TextField
                          {...field}
                          label="Amount"
                          variant="outlined"
                          fullWidth
                          helperText="Enter amount in format: <=100, >=100, <100, >100"
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  MMK
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      );
                  }
                }}
              />
            )}
            {errors.conditionValue && (
              <Typography variant="caption" color="error">
                {errors.conditionValue.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Controller
              name="department"
              control={control}
              // rules={{ required: "Department is required!" }}
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
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              label="Priority"
              type="number"
              variant="outlined"
              {...register("priority", { required: "Priority is required!" })}
              fullWidth
              helperText="Higher value is higher priority"
            />
            {errors.priority && (
              <Typography variant="caption" color="error">
                {errors.priority.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={12}>
            <Controller
              name="roles"
              control={control}
              rules={{ required: "Approver Roles is required!" }}
              render={({ field }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-multiple-chip-label">
                    Approver Roles
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    {...field}
                    input={<OutlinedInput label="Approver Roles" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const label = roles.data.find(
                            (a) => a.id === value
                          ).name;
                          return <Chip key={value} label={label} />;
                        })}
                      </Box>
                    )}
                  >
                    {roles.data.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.roles && (
              <Typography variant="caption" color="error">
                {errors.roles.message}
              </Typography>
            )}
          </Grid2>
        </Grid2>
        <Box
          display="flex"
          justifyContent={{ xs: "space-between", md: "flex-end" }}
        >
          <Button
            sx={{ mr: 2 }}
            onClick={() => navigate("/policies")}
            variant="contained"
            startIcon={<ArrowBackIos />}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<Send />}
          >
            {isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </Box>
        {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
      </Paper>
    </Box>
  );
}

export default PolicyForm;
