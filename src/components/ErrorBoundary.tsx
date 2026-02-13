import React from 'react'
import { Alert, Box, Button } from '@mui/material'

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'Что-то сломалось'

      return (
        <Box p={3}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Произошла ошибка: {message}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Перезагрузить страницу
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}