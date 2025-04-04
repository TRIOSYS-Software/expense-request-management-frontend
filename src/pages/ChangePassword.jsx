import {
  Box,
  Button,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useApp } from "../ThemedApp";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { changePassword } from "../libs/fetcher";

export default function ChangePassword() {
  const { auth, setGlobalMsg } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const change = useMutation((data) => changePassword(auth.id, data), {
    onSuccess: (data) => {
      setGlobalMsg("Password changed successfully!");
      navigate("/");
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setError("root", { message: error.response.data });
      } else {
        setError("root", { message: error.message });
      }
    },
  });

  const onSubmit = async (data) => {
    const request = {
      old_password: data.old_password,
      new_password: data.new_password,
    };
    change.mutate(request);
  };

  return (
    <Box
      component={"form"}
      sx={{ maxWidth: "md", mx: "auto" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5">Change Password</Typography>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <TextField
              {...register("old_password", {
                required: "Old Password is required!",
              })}
              label="Old Password"
              type="password"
              fullWidth
              variant="outlined"
            />
            {errors.old_password && (
              <Typography variant="caption" color="error">
                {errors.old_password.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={12}>
            <TextField
              {...register("new_password", {
                required: "New Password is required!",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long!",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
                },
                validate: (value) => {
                  if (value === watch("old_password")) {
                    return "New password cannot be the same as old password!";
                  }
                  return true;
                },
              })}
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
            />
            {errors.new_password && (
              <Typography variant="caption" color="error">
                {errors.new_password.message}
              </Typography>
            )}
          </Grid2>
          <Grid2 size={12}>
            <TextField
              {...register("confirm_password", {
                required: "Confirm Password is required!",
                validate: (value) => {
                  if (value !== watch("new_password")) {
                    return "Passwords do not match!";
                  }
                  return true;
                },
              })}
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
            />
            {errors.confirm_password && (
              <Typography variant="caption" color="error">
                {errors.confirm_password.message}
              </Typography>
            )}
          </Grid2>
        </Grid2>
        {errors.root && (
          <Typography variant="caption" color="error">
            {errors.root.message}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
