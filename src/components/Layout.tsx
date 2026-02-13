import React from 'react'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Chip
} from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MapIcon from '@mui/icons-material/Map'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'

function TopTab({ to, active, icon, label }) {
  return (
    <Box
      component={NavLink}
      to={to}
      sx={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.8,
        borderRadius: '999px',
        color: 'text.primary',
        border: '1px solid',
        borderColor: active ? 'divider' : 'transparent',
        backgroundColor: active ? 'action.selected' : 'transparent',
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      {icon}
      <Typography variant="body2" fontWeight={600}>
        {label}
      </Typography>
    </Box>
  )
}

export default function Layout({ children, mode, onToggleMode }) {
  const { pathname } = useLocation()

  const isVehicles = pathname.startsWith('/vehicles')
  const isMap = pathname.startsWith('/map')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 1.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DirectionsCarIcon sx={{ color: 'white' }} />
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Vehicles
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CRUD + Карта
                </Typography>
              </Box>

              <Chip
                size="small"
                label="Vite + React + TS"
                sx={{ ml: 1.5, fontWeight: 500 }}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <TopTab
                to="/vehicles"
                active={isVehicles}
                icon={<DirectionsCarIcon fontSize="small" />}
                label="Список"
              />

              <TopTab
                to="/map"
                active={isMap}
                icon={<MapIcon fontSize="small" />}
                label="Карта"
              />

              <Tooltip title={mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
                <IconButton onClick={onToggleMode} size="medium">
                  {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          {children}
        </Container>
      </Box>

      <Box sx={{ py: 2, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {isMap ? 'Режим карты' : 'Список транспорта'} • Zustand
        </Typography>
      </Box>
    </Box>
  )
}