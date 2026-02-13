import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material'

import Layout from './components/Layout'
import VehiclesToolbar from './components/VehiclesToolbar'
import VehiclesTable from './components/VehiclesTable'
import VehicleFormDialog from './components/VehicleFormDialog'
import ConfirmDialog from './components/ConfirmDialog'
import VehiclesMap from './components/VehiclesMap'
import ToastHost from './components/ToastHost'
import { useVehiclesStore } from './store/vehiclesStore'
import type { Vehicle } from './types/vehicle'
import { ErrorBoundary } from './components/ErrorBoundary'
import { sortVehicles } from './utils/sort'
import { filterVehicles } from './utils/filter'

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  )
}

function VehiclesPage() {
  const status = useVehiclesStore(s => s.status)
  const error = useVehiclesStore(s => s.error)
  const load = useVehiclesStore(s => s.load)
  const vehicles = useVehiclesStore(s => s.vehicles)
  const sort = useVehiclesStore(s => s.sort)
  const filter = useVehiclesStore(s => s.filter)
  const paging = useVehiclesStore(s => s.paging)

  const create = useVehiclesStore(s => s.create)
  const edit = useVehiclesStore(s => s.edit)
  const remove = useVehiclesStore(s => s.remove)

  const visible = useMemo(() => {
    const filtered = filterVehicles(vehicles, filter)
    const sorted = sortVehicles(filtered, sort)
    const start = paging.page * paging.rowsPerPage

    return {
      total: sorted.length,
      rows: sorted.slice(start, start + paging.rowsPerPage)
    }
  }, [vehicles, filter, sort, paging])

  const [createOpen, setCreateOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null)
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    load()
  }, [load])

  if (status === 'loading') {
    return (
      <Box sx={{ p: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Автомобили"
        subtitle="Добавление, редактирование (name/price), удаление и сортировка"
      />

      {status === 'error' && (
        <Paper variant="outlined" sx={{ p: 2, borderColor: 'warning.main' }}>
          <Typography color="warning.main" fontWeight="bold">
            Ошибка загрузки: {error || 'неизвестная ошибка'}
          </Typography>
          <Button size="small" onClick={load} sx={{ mt: 1 }}>
            Попробовать снова
          </Button>
        </Paper>
      )}

      <Paper>
        <VehiclesToolbar onCreate={() => setCreateOpen(true)} />
      </Paper>

      <VehiclesTable
        vehicles={visible.rows}
        total={visible.total}
        onEdit={setEditVehicle}
        onDelete={setDeleteVehicle}
      />

      <VehicleFormDialog
        mode="create"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async data => {
          await create(data)
          setCreateOpen(false)
        }}
      />

      {editVehicle && (
        <VehicleFormDialog
          mode="edit"
          open={true}
          initial={editVehicle}
          onClose={() => setEditVehicle(null)}
          onSubmit={async data => {
            await edit(editVehicle.id, data)
            setEditVehicle(null)
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteVehicle}
        title="Удалить автомобиль?"
        description={
          deleteVehicle
            ? `Удалить ${deleteVehicle.name} ${deleteVehicle.model}?`
            : ''
        }
        confirmText="Удалить"
        onClose={() => setDeleteVehicle(null)}
        onConfirm={async () => {
          if (deleteVehicle) {
            await remove(deleteVehicle.id)
            setDeleteVehicle(null)
          }
        }}
      />
    </Stack>
  )
}

function MapPage() {
  const status = useVehiclesStore(s => s.status)
  const vehicles = useVehiclesStore(s => s.vehicles)
  const load = useVehiclesStore(s => s.load)

  useEffect(() => {
    if (!vehicles.length && status !== 'loading') {
      load()
    }
  }, [vehicles.length, status, load])

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Карта"
        subtitle="Автомобили с координатами"
      />

      <Paper sx={{ height: 600, overflow: 'hidden' }}>
        <VehiclesMap vehicles={vehicles} />
      </Paper>
    </Stack>
  )
}

export default function App({
  mode,
  setMode
}: {
  mode: 'light' | 'dark'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
}) {
  const toggleTheme = () =>
    setMode(mode === 'dark' ? 'light' : 'dark')

  return (
    <ErrorBoundary>
      <Layout mode={mode} onToggleMode={toggleTheme}>
        <ToastHost />
        <Routes>
          <Route path="/" element={<Navigate to="/vehicles" replace />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/vehicles" replace />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}