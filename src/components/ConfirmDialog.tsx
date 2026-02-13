import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'

export interface ConfirmDialogProps {
  open: boolean
  title: React.ReactNode
  description: React.ReactNode
  confirmText?: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Подтвердить',
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1">{description}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
