import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Collapse,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import type { CreateVehicleInput, Vehicle } from '../types/vehicle'

const CreateSchema = z.object({
  name: z.string().trim().min(1, 'Обязательно'),
  model: z.string().trim().min(1, 'Обязательно'),
  year: z.coerce.number().int().min(1886).max(2100),
  color: z.string().trim().min(1, 'Обязательно'),
  price: z.coerce.number().min(0, '≥ 0'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional()
})

const EditSchema = z.object({
  name: z.string().trim().min(1, 'Обязательно'),
  price: z.coerce.number().min(0, '≥ 0')
})

type FormValues = z.infer<typeof CreateSchema> & {
  name: string
  price: number
}

type VehicleFormDialogProps =
  | {
      mode: 'create'
      open: boolean
      onClose: () => void
      onSubmit: (data: CreateVehicleInput) => Promise<void> | void
    }
  | {
      mode: 'edit'
      open: boolean
      onClose: () => void
      initial: Vehicle
      onSubmit: (data: { name: string; price: number }) => Promise<void> | void
    }

export default function VehicleFormDialog(props: VehicleFormDialogProps) {
  const { mode, open, onClose } = props
  const isEdit = mode === 'edit'
  const initial = isEdit ? initial : undefined


  const [showCoords, setShowCoords] = useState(false)

  const schema = isEdit ? EditSchema : CreateSchema
  const resolver = useMemo(() => zodResolver(schema), [isEdit])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver })

  useEffect(() => {
    if (!open) return

    if (isEdit) {
      reset({
        name: initial.name,
        price: initial.price
      })
      setShowCoords(false)
    } else {
      reset({
        name: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        price: 0,
        latitude: undefined,
        longitude: undefined
      })
    }
  }, [open, isEdit, initial, reset])

  const onSubmit = async (data: FormValues) => {
    if (isEdit) {
      await props.onSubmit({
        name: data.name.trim(),
        price: Number(data.price)
      })
    } else {
      await props.onSubmit({
        name: data.name.trim(),
        model: data.model?.trim() || '',
        year: Number(data.year),
        color: data.color?.trim() || '',
        price: Number(data.price),
        latitude: data.latitude ? Number(data.latitude) : undefined,
        longitude: data.longitude ? Number(data.longitude) : undefined
      })
    }

    onClose()
  }

  const title = isEdit ? 'Редактировать авто' : 'Добавить авто'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Название"
              fullWidth
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Цена"
              fullWidth
              type="number"
              error={!!errors.price}
              helperText={errors.price?.message}
              {...register('price')}
            />
          </Grid>

          {!isEdit && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Модель"
                  fullWidth
                  error={!!errors.model}
                  helperText={errors.model?.message}
                  {...register('model')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Год"
                  fullWidth
                  type="number"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  {...register('year')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Цвет"
                  fullWidth
                  error={!!errors.color}
                  helperText={errors.color?.message}
                  {...register('color')}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showCoords}
                      onChange={e => setShowCoords(e.target.checked)}
                    />
                  }
                  label="Указать координаты (необязательно)"
                />
              </Grid>

              <Grid item xs={12}>
                <Collapse in={showCoords}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Широта"
                        fullWidth
                        type="number"
                        {...register('latitude')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Долгота"
                        fullWidth
                        type="number"
                        {...register('longitude')}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}