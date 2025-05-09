import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { forgotPassword } from "../libs";
import { useApp } from "../ThemedApp";
import { useState } from "react";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const [loading, isLoading] = useState(false);
  const [success, isSuccess] = useState(false);

  const sent = useMutation(async (request) => await forgotPassword(request), {
    onSuccess: (data) => {
      reset();
      isLoading(false);
      isSuccess(true);
    },
    onError: (error) => {
      setError("root", { message: "Your email is not registered!" });
      isLoading(false);
      reset();
    },
  });

  const onSubmit = async (data) => {
    const request = {
      email: data.email,
    };
    sent.mutate(request);
    isLoading(true);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper evaluation={3} sx={{ p: { xs: 2, md: 6 } }}>
        <Typography variant="h4">Expense Request Management</Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="body1">Password Reset</Typography>
          <TextField
            {...register("email", {
              required: true,
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "invalid email address",
              },
            })}
            label="Email"
            variant="outlined"
            helperText="Enter your email to reset your password"
          />
          {errors.email && (
            <Typography variant="body2" sx={{ color: "red" }}>
              {errors.email.message}
            </Typography>
          )}
          <Button type="submit" variant="contained" loading={loading}>
            Continue
          </Button>
        </Box>
        {errors.root && (
          <Typography variant="body2" sx={{ color: "red" }}>
            {errors.root.message}
          </Typography>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Password reset link has been sent to your email!
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
