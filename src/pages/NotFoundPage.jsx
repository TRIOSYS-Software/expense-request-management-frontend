import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: 2,
      }}
    >
      <Typography
        sx={{ fontStyle: "italic", textDecoration: "blink", fontSize: "5rem" }}
      >
        404 - Page Not Found
      </Typography>
      <Link to="/">Go to Home</Link>
    </Box>
  );
}
