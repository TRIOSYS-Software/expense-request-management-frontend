import {
  Box,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

function PolicyForm() {
  return (
    <Box sx={{ maxWidth: "md", mx: "auto" }}>
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">Policy Form</Typography>
        <Grid2 container spacing={2} sx={{ my: 2 }}>
          <Grid2 size={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="cd-type">Condition Type</InputLabel>
              <Select labelId="cd-type" id="cd-type" label="Condition Type">
                <MenuItem value={"category"}>Category</MenuItem>
                <MenuItem value={"amount"}>Amount</MenuItem>
                <MenuItem value={"user"}>Requester</MenuItem>
                <MenuItem value={"project"}>Project</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="cd-value">Condition Value</InputLabel>
              <Select labelId="cd-value" id="cd-type" label="Condition Value">
                <MenuItem value={"category"}>Category</MenuItem>
                <MenuItem value={"amount"}>Amount</MenuItem>
                <MenuItem value={"user"}>Requester</MenuItem>
                <MenuItem value={"project"}>Project</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
      </Paper>
    </Box>
  );
}

export default PolicyForm;
