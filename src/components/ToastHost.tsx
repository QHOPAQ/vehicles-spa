import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useVehiclesStore } from "../store/vehiclesStore";

export default function ToastHost() {
  const toasts = useVehiclesStore((s) => s.toasts);
  const popToast = useVehiclesStore((s) => s.popToast);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = activeId ? toasts.find((t) => t.id === activeId) : undefined;

  useEffect(() => {
    if (active) return;
    if (!toasts.length) return;
    setActiveId(toasts[0].id);
    setOpen(true);
  }, [toasts, active]);

  const handleClose = () => setOpen(false);

  const handleExited = () => {
    if (activeId) popToast(activeId);
    setActiveId(null);
  };

  if (!active) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3200}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={active.severity} variant="filled" sx={{ width: "100%" }}>
        {active.message}
      </Alert>
    </Snackbar>
  );
}
