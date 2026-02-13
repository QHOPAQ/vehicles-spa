import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  TablePagination,
  TableSortLabel,
  Chip,
  Stack,
  Tooltip
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import type { Vehicle, SortField } from "../types/vehicle";
import { useVehiclesStore } from "../store/vehiclesStore";

function money(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function VehiclesTable({
  vehicles,
  total,
  onEdit,
  onDelete
}: {
  vehicles: Vehicle[];
  total: number;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
}) {
  const paging = useVehiclesStore((s) => s.paging);
  const setPaging = useVehiclesStore((s) => s.setPaging);

  const sort = useVehiclesStore((s) => s.sort);
  const setSort = useVehiclesStore((s) => s.setSort);

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      setSort({ field, direction: "asc" });
    }
  };

  if (!vehicles.length) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 700 }}>No vehicles found</Typography>
        <Typography variant="body2" color="text.secondary">
          Try changing search query or create a new car.
        </Typography>
      </Paper>
    );
  }

  const isYear = sort.field === "year";
  const isPrice = sort.field === "price";

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size="small" aria-label="vehicles-table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Color</TableCell>

              <TableCell
                align="right"
                sortDirection={isYear ? sort.direction : false}
                sx={{
                  fontWeight: 900,
                  ...(isYear && {
                    background:
                      "linear-gradient(180deg, rgba(80,120,255,0.20), rgba(80,120,255,0.06))"
                  })
                }}
              >
                <TableSortLabel
                  active={isYear}
                  direction={isYear ? sort.direction : "asc"}
                  onClick={() => handleSort("year")}
                >
                  Year
                </TableSortLabel>
              </TableCell>

              <TableCell
                align="right"
                sortDirection={isPrice ? sort.direction : false}
                sx={{
                  fontWeight: 900,
                  ...(isPrice && {
                    background:
                      "linear-gradient(180deg, rgba(255,120,200,0.18), rgba(255,120,200,0.05))"
                  })
                }}
              >
                <TableSortLabel
                  active={isPrice}
                  direction={isPrice ? sort.direction : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Price
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 900 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vehicles.map((v, idx) => (
              <TableRow
                key={v.id}
                hover
                sx={{
                  transition: "transform 120ms ease, background 120ms ease",
                  backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, rgba(80,120,255,0.10), rgba(255,120,200,0.08))",
                    transform: "translateY(-1px)"
                  }
                }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 850 }}>{v.name}</Typography>
                    <Chip size="small" label={`#${v.id}`} sx={{ borderRadius: 999, opacity: 0.9 }} />
                  </Stack>
                </TableCell>

                <TableCell sx={{ fontWeight: 650 }}>{v.model}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={v.color}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, rgba(80,120,255,0.18), rgba(255,120,200,0.14))"
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 850 }}>{v.year}</Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography sx={{ fontWeight: 900 }}>
                    {money(v.price)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip title="Edit (name & price)">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(v)}
                        aria-label="edit"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(v)}
                        aria-label="delete"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={paging.page}
        onPageChange={(_, page) => setPaging({ page })}
        rowsPerPage={paging.rowsPerPage}
        onRowsPerPageChange={(e) => setPaging({ rowsPerPage: Number(e.target.value), page: 0 })}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}