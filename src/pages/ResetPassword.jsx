import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, validatePasswordResetToken } from "../libs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [loading, isLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const reset = useMutation((data) => resetPassword(data), {
    onSuccess: (data) => {
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

  useEffect(() => {
    if (!token || !email) {
      window.location.href = "/forgot-password";
    }
    validatePasswordResetToken({ token, email })
      .then((data) => {
        if (data.valid) {
          setValid(true);
          isLoading(false);
        }
      })
      .catch(() => {
        setValid(false);
        isLoading(false);
      });
  }, [valid, token, email]);

  const onSubmit = (data) => {
    const request = {
      email: email,
      password: data.password,
    };
    reset.mutate(request);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
      >
        <Typography variant="h5">Expense Request Management System</Typography>
        <Typography variant="body1">Reset Password</Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={50} />
          </Box>
        ) : valid ? (
          <Box
            component={"form"}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required!",
                minLength: {
                  value: 8,
                  message: "Password must bet at least 8 characters!",
                },
              })}
            />
            {errors.password && (
              <Typography variant="body2" sx={{ color: "red" }}>
                {errors.password.message}
              </Typography>
            )}
            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirm_password", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match!",
              })}
            />
            {errors.confirm_password && (
              <Typography variant="body2" sx={{ color: "red" }}>
                {errors.confirm_password.message}
              </Typography>
            )}
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </Box>
        ) : (
          <Alert severity="error">
            Your Password Reset link is invalid or Expired!{" "}
            <Link to="/forgot-password">Try again</Link>{" "}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
