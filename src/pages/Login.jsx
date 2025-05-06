import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useApp } from "../ThemedApp";
import { useMutation } from "react-query";
import { postLogin } from "../libs/fetcher";

const Login = () => {
  const { setAuth } = useApp();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const login = useMutation(
    async ({ email, password }) => postLogin(email, password),
    {
      onSuccess: async (data) => {
        setAuth({ ...data.User, roles: data.User.roles });
        localStorage.setItem("token", data.Token);
        navigate("/");
      },
      onError: (error) => {
        if (error.response.status == 401)
          setError("root", { message: "Incorrect Username or Password" });

        if (error.response && error.response.data) {
          setError("root", { message: error.response.data });
        } else {
          setError("root", { message: error.message });
        }
      },
    }
  );

  const onSubmit = (data) => {
    const { email, password } = data;
    login.mutate({ email, password });
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
        <Typography variant="h4" gutterBottom>
          {" "}
          Expense Request Management{" "}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, m: 1 }}
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            required
            id="outlined-email-input"
            label="Email"
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "invalid email address",
              },
            })}
          />
          {errors.email && (
            <Typography variant="body2" color="error">
              {errors.email.message}
            </Typography>
          )}
          <TextField
            required
            id="outlined-password-input"
            type="password"
            label="Password"
            {...register("password", {
              required: "Password is required!",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
          {errors.password && (
            <Typography variant="body2" color="error">
              {errors.password.message}
            </Typography>
          )}
          <Button disabled={isSubmitting} type="submit" variant="contained">
            {isSubmitting ? <CircularProgress /> : "Login"}
          </Button>
          {errors.root && (
            <Typography variant="body2" color="error">
              {errors.root.message}
            </Typography>
          )}
          <Typography>
            <Link component={RouterLink} to={"/forgot-password"}>
              Forgot Password?{" "}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
