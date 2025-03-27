import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  IconButton,
  Grid2,
  Typography,
} from "@mui/material";
import { Remove } from "@mui/icons-material";
import { Controller } from "react-hook-form";

const MultiSelectBox = ({
  id,
  control,
  name,
  options,
  onRemove,
  canRemove,
}) => {
  return (
    <Grid2 size={12}>
      <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
        <Controller
          name={name}
          control={control}
          rules={{ required: "Approver is required!" }}
          render={({ field, fieldState: { error } }) => (
            <FormControl variant="outlined" fullWidth error={!!error}>
              <InputLabel id={`multi-select-label-${id}`}>
                Approver Level {id + 1}
              </InputLabel>
              <Select
                labelId={`multi-select-label-${id}`}
                id={`multi-select-${id}`}
                multiple
                input={<OutlinedInput label={`Approver Level ${id + 1}`} />}
                {...field}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.map((value) => {
                      const label = options.find(
                        (opt) => opt.id === value
                      ).name;
                      return <Chip key={value} label={label} />;
                    })}
                  </Box>
                )}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} ({option.departments.name})
                  </MenuItem>
                ))}
              </Select>
              {error && (
                <Typography variant="caption" color="error">
                  {error.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
        {canRemove && (
          <IconButton onClick={onRemove} color="error" size="small">
            <Remove size={18} />
          </IconButton>
        )}
      </Box>
    </Grid2>
  );
};
export default MultiSelectBox;
