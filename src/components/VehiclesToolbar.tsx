import React from "react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useVehiclesStore } from "../store/vehiclesStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function VehiclesToolbar({ onCreate }: { onCreate: () => void }) {
  const filter = useVehiclesStore((s) => s.filter);
  const setFilter = useVehiclesStore((s) => s.setFilter);

  const [qInput, setQInput] = React.useState(filter.q);
  const qDebounced = useDebouncedValue(qInput, 250);

  React.useEffect(() => {
    setFilter({ q: qDebounced });
  }, [qDebounced, setFilter]);

  return (
    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" justifyContent="space-between">
      <TextField
        label="Search"
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
        sx={{ minWidth: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreate}>
        Add car
      </Button>
    </Box>
  );
}