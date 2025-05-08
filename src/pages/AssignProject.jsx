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
  fetchUsersByRole,
  getProjects,
  getUserProjects,
  setUserProjects,
} from "../libs/fetcher";
import { useMutation, useQueries, useQuery } from "react-query";
import { queryClient, useApp } from "../ThemedApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AssignProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setGlobalMsg } = useApp();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      user: "",
      projects: [],
    },
  });

  const queries = [
    {
      queryKey: "users",
      queryFn: () => fetchUsersByRole(3),
    },
    {
      queryKey: "projects",
      queryFn: () => getProjects(),
    },
  ];

  const results = useQueries(queries);
  const [users, projects] = results;

  // If editing, fetch user's current projects
  const { data: userProjects } = useQuery(
    ["user-projects", id],
    () => getUserProjects(id),
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (id) {
      setValue("user", id);
      if (userProjects) {
        setValue(
          "projects",
          userProjects.map((p) => p.code)
        );
      }
    }
  }, [id, userProjects, setValue]);

  const create = useMutation(setUserProjects, {
    onSuccess: () => {
      setGlobalMsg("Projects assigned successfully!");
      reset();
      queryClient.invalidateQueries(["users-projects"]);
      if (id) {
        queryClient.invalidateQueries(["user-projects", id]);
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
      projects: data.projects,
    };
    create.mutate(request);
  };

  if (users.isLoading || projects.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.isError || projects.isError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
        <Alert severity="error">
          {users.error.message || projects.error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component={"form"}
      sx={{ maxWidth: "md", mx: "auto" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">
          {id ? "Edit User Projects" : "Assign Projects"}
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
              <InputLabel id="project-select-label">Projects</InputLabel>
              <Controller
                name="projects"
                control={control}
                rules={{
                  required: "Projects are required!",
                }}
                render={({ field, fieldState: { error } }) => (
                  <Select
                    {...field}
                    labelId="project-select-label"
                    id="project-select"
                    label="Projects"
                    multiple
                    input={<OutlinedInput label="Projects" />}
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
                    {projects.data.map((project) => (
                      <MenuItem key={project.code} value={project.code}>
                        {project.description}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            {errors.projects && (
              <Typography color="error">{errors.projects.message}</Typography>
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
