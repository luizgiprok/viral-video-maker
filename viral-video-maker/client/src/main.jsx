import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './contexts/AuthContext'
import { VideoProvider } from './contexts/VideoContext'
import App from './App'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <AuthProvider>
              <VideoProvider>
                <GlobalStyles />
                <App />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      style: {
                        background: '#4caf50',
                        color: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      style: {
                        background: '#f44336',
                        color: '#fff',
                      },
                    },
                  }}
                />
              </VideoProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)