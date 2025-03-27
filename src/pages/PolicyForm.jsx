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
  fetchPolicyById,
  fetchRoles,
  fetchUsersByRole,
  getProjects,
  updatePolicy,
} from "../libs/fetcher";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Add, ArrowBackIos, Send } from "@mui/icons-material";
import { useApp } from "../ThemedApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { parse } from "date-fns";
import MultiSelectBox from "../components/MultiSelectBox";

function PolicyForm() {
  const { id } = useParams();
  const { setGlobalMsg } = useApp();
  const navigate = useNavigate();
  const queries = [
    {
      queryKey: "approvers",
      queryFn: () => fetchUsersByRole(2),
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

  const [approvers, departments, expenseCategories, projects] = results;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      approvers: [],
      department: "",
      project: "",
      approvers: [
        {
          values: [],
        },
      ],
    },
  });

  const { data } = useQuery(["policy", id], () => fetchPolicyById(id), {
    enabled: !!id,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "approvers",
  });

  const watchApprovers = useWatch({ control, name: "approvers" });

  const getAvailableOptions = (currentIndex) => {
    const selectedValues = watchApprovers?.reduce((acc, box, index) => {
      if (index !== currentIndex && box.values) {
        return [...acc, ...box.values];
      }
      return acc;
    }, []);
    return approvers.data.filter(
      (option) => !selectedValues.includes(option.id)
    );
  };

  const handleRemoveSelectBox = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleAddSelectBox = () => {
    append({
      values: [],
    });
  };

  useEffect(() => {
    if (data) {
      reset({
        approvers: data.policy_users?.map((r) => r.Approver.id),
        department: data.department,
        min_amount: data.min_amount,
        max_amount: data.max_amount,
        priority: data.priority,
        project: data.project,
      });
    }
  }, [data]);

  const create = useMutation(async (data) => createPolicy(data), {
    onSuccess: (data) => {
      setGlobalMsg("Policy created successfully!");
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

  const update = useMutation(async (data) => updatePolicy(id, data), {
    onSuccess: (data) => {
      setGlobalMsg("Policy updated successfully!");
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

  const onSubmit = (data) => {
    const request = {
      min_amount: parseInt(data.min_amount),
      max_amount: parseInt(data.max_amount),
      project: data.project,
      department_id: data.department || null,
      approvers: data.approvers.flatMap((subArray, index) =>
        subArray.values.map((v) => ({ approver_id: v, level: index + 1 }))
      ),
    };
    // console.log(request);
    if (id) {
      update.mutate(request);
    } else {
      create.mutate(request);
    }
  };

  if (
    approvers.isLoading ||
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
    approvers.isError ||
    departments.isError ||
    expenseCategories.isError ||
    projects.isError
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">{approvers.error || departments.error}</Alert>
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
            {/* <Controller
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
            /> */}
            <TextField
              {...register("min_amount", {
                required: "Min Amount is required!",
              })}
              type="number"
              label="Min Amount"
              variant="outlined"
              fullWidth
            />
            {errors.min_amount && (
              <Typography variant="caption" color="error">
                {errors.min_amount.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            {/* {watchedField && (
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
                            {expenseCategories.data.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
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
            )} */}
            <TextField
              {...register("max_amount", {
                required: "Max Amount is required!",
                validate: (value) => {
                  if (parseInt(watch("min_amount")) >= parseInt(value)) {
                    return "Max amount must be greater than min amount";
                  }
                  return true;
                },
              })}
              type="number"
              label="Max Amount"
              variant="outlined"
              fullWidth
            />
            {errors.max_amount && (
              <Typography variant="caption" color="error">
                {errors.max_amount.message}
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
            <Controller
              name="project"
              control={control}
              rules={{ required: "Project is required!" }}
              render={({ field }) => (
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
              )}
            />
            {errors.project && (
              <Typography variant="caption" color="error">
                {errors.project.message}
              </Typography>
            )}
          </Grid2>
          {fields.map((field, index) => (
            <MultiSelectBox
              id={index}
              key={field.id}
              control={control}
              options={getAvailableOptions(index)}
              name={`approvers.${index}.values`}
              onRemove={() => handleRemoveSelectBox(index)}
              canRemove={fields.length > 1}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add size={18} />}
            onClick={handleAddSelectBox}
          >
            Approver Level
          </Button>
          {/* <Grid2 size={12}>
            <Controller
              name="approvers"
              control={control}
              rules={{ required: "Approver Roles is required!" }}
              render={({ field }) => (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-multiple-chip-label">
                    Approvers
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    {...field}
                    input={<OutlinedInput label="Approvers" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const label = approvers.data.find(
                            (a) => a.id === value
                          ).name;
                          return <Chip key={value} label={label} />;
                        })}
                      </Box>
                    )}
                  >
                    {approvers.data.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} ({option.departments.name})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.approvers && (
              <Typography variant="caption" color="error">
                {errors.approvers.message}
              </Typography>
            )}
          </Grid2> */}
        </Grid2>
        <Box
          display="flex"
          justifyContent={{ xs: "space-between", md: "flex-end" }}
        >
          <Button
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
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
