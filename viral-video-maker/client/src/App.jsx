import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Helmet } from 'react-helmet-async'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Videos from './pages/Videos'
import Upload from './pages/Upload'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Billing from './pages/Billing'
import Team from './pages/Team'
import NotFound from './pages/NotFound'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Helmet>
        <title>Viral Video Maker - Crie vídeos virais com IA</title>
        <meta name="description" content="Plataforma SaaS para criação automática de vídeos otimizados para YouTube e TikTok" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="register" element={<AuthLayout><Register /></AuthLayout>} />
        </Route>

        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="videos" element={<Videos />} />
            <Route path="upload" element={<Upload />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<Billing />} />
            <Route path="team" element={<Team />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App