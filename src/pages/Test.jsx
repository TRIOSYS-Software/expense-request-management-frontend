import { Delete, Remove, Send } from "@mui/icons-material";
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useQuery } from "react-query";
import { fetchExpenseCategories } from "../libs/fetcher";

const Test = () => {
  const { isLoading, isError, error, data } = useQuery(
    "expense-categories",
    fetchExpenseCategories
  );

  const projects = [
    { value: "project1", label: "Project 1" },
    { value: "project2", label: "Project 2" },
    { value: "project3", label: "Project 3" },
  ];

  const approversValue = [
    { id: 1, name: "Approver 1" },
    { id: 2, name: "Approver 2" },
    { id: 3, name: "Approver 3" },
  ];

  const [approver, setApprover] = useState([]);

  const handleApproverChange = (event) => {
    const {
      target: { value },
    } = event;

    setApprover(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const [approver, setApprover] = useState([]);
  // const [selectedApprover, setSelectedApproverValue] = useState("None");

  // const handleAddApprover = () => {
  //   if (selectedApprover) {
  //     if (selectedApprover !== "None") {
  //       setApprover([
  //         ...approver,
  //         approversValue.find((a) => a.value === selectedApprover),
  //       ]);
  //       setSelectedApproverValue("");
  //     }
  //   }
  // };

  // const handleRemoveApprover = (index) => {
  //   const values = [...approver];
  //   values.splice(index, 1);
  //   setApprover(values);
  //   setApproverValue([...approverValue, approver[index]]);
  // };

  // const handleApproverChange = (event) => {
  //   // setSelectedApproverValue(event.target.value);
  //   if (event.target.value !== "None") {
  //     setApprover([
  //       ...approver,
  //       approversValue.find((a) => a.value === event.target.value),
  //     ]);

  //     setApproverValue(
  //       approverValue.filter((a) => a.value !== event.target.value)
  //     );

  //     // setSelectedApproverValue("");
  //   }
  // };

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">Cannot fetch data. {error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component={"form"}
      onSubmit={(e) => {
        e.preventDefault();
        alert("Welcome");
      }}
      sx={{ maxWidth: "md", mx: "auto" }}
    >
      <Paper elevation={24} sx={{ p: 2, my: 2 }}>
        <Typography variant="h5">Expense Form</Typography>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Submitted Date"
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Project"
              slotProps={{ inputLabel: { shrink: true } }}
              defaultValue={""}
              fullWidth
            >
              <MenuItem value="">Choose an option</MenuItem>
              {projects.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField type="number" label="Amount" fullWidth></TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Category"
              slotProps={{ inputLabel: { shrink: true } }}
              defaultValue={""}
              fullWidth
            >
              <MenuItem value="">Choose an option</MenuItem>
              {data.map((e) => (
                <MenuItem key={e.id} value={e.name}>
                  {e.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12}>
            <TextField multiline rows={5} label="Description" fullWidth />
          </Grid>
          <Grid size={12}>
            <TextField
              type="file"
              label="Attachment"
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { accept: "image/*, application/pdf" },
              }}
              fullWidth
            />
          </Grid>
          {/* <Grid size={12}>
            {approver.length !== 0 ? (
              <List>
                {approver.map((a, index) => (
                  <Card sx={{ mt: 1 }}>
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton onClick={() => handleRemoveApprover(index)}>
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={a.label} />
                    </ListItem>
                  </Card>
                ))}
              </List>
            ) : (
              <div></div>
            )}
          </Grid> */}
          {/* <Grid size={12}>
            <TextField
              select
              label="Approver (optional)"
              slotProps={{ inputLabel: { shrink: true } }}
              // value={"None"}
              placeholder="Select an option"
              onChange={handleApproverChange}
              fullWidth
            >
              <MenuItem value="None">None</MenuItem>
              {approverValue.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid> */}
        </Grid>
        <Grid size={12}>
          <FormControl sx={{ my: 1, width: "100%" }}>
            <InputLabel id="demo-multiple-chip-label">Approvers</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={approver}
              onChange={handleApproverChange}
              input={
                <OutlinedInput id="select-multiple-chip" label="Approvers" />
              }
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
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" startIcon={<Send />}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Test;
