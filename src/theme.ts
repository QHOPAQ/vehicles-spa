import { alpha, createTheme } from '@mui/material/styles'

export function buildTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#4f46e5',          // indigo-ish
        light: '#6366f1',
        dark: '#4338ca'
      },
      background: {
        default: isDark ? '#0a0f1a' : '#f8fafc',
        paper: isDark ? alpha('#111827', 0.75) : alpha('#ffffff', 0.82)
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a'
      }
    },

    shape: {
      borderRadius: 12
    },

    typography: {
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h5: { fontWeight: 700, letterSpacing: -0.4 },
      h6: { fontWeight: 700, letterSpacing: -0.2 },
      button: { textTransform: 'none', fontWeight: 600 }
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(circle at 15% -20%, rgba(79,70,229,0.28), transparent 50%), radial-gradient(circle at 85% 10%, rgba(236,72,153,0.18), transparent 60%)'
              : 'radial-gradient(circle at 15% -20%, rgba(79,70,229,0.12), transparent 50%), radial-gradient(circle at 85% 10%, rgba(236,72,153,0.08), transparent 60%)',
            backgroundAttachment: 'fixed'
          }
        }
      },

      MuiPaper: {
        defaultProps: {
          elevation: 0
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)'}`,
            backdropFilter: 'blur(10px) saturate(180%)',
            boxShadow: isDark
              ? '0 10px 32px rgba(0,0,0,0.4)'
              : '0 10px 32px rgba(0,0,0,0.08)'
          }
        }
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'rgba(17,24,39,0.75)'
              : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(12px) saturate(180%)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)'}`,
            boxShadow: 'none'
          }
        }
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600
          },
          contained: {
            boxShadow: isDark
              ? '0 8px 20px rgba(0,0,0,0.3)'
              : '0 8px 20px rgba(0,0,0,0.12)'
          }
        }
      },

      MuiTextField: {
        defaultProps: {
          size: 'small',
          variant: 'outlined'
        }
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(15,23,42,0.03)'
          }
        }
      }
    }
  })
}