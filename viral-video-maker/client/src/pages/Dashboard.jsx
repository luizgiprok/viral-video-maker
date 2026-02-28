import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useVideo } from '../contexts/VideoContext'

const Dashboard = () => {
  const { user } = useAuth()
  const { videos, stats } = useVideo()

  const dashboardStats = [
    {
      title: 'Vídeos Processados',
      value: stats.videosProcessed || 0,
      icon: '📹',
      color: 'bg-blue-500'
    },
    {
      title: 'Total de Views',
      value: stats.totalViews || 0,
      icon: '👁️',
      color: 'bg-green-500'
    },
    {
      title: 'Engajamento',
      value: `${stats.engagementRate || 0}%`,
      icon: '❤️',
      color: 'bg-red-500'
    },
    {
      title: 'Receita',
      value: `€${stats.revenue || 0}`,
      icon: '💰',
      color: 'bg-yellow-500'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard - Viral Video Maker</title>
        <meta name="description" content="Dashboard do Viral Video Maker" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo de volta, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Aqui está um resumo do seu desempenho
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {dashboardStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Upload Video */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎥 Upload de Vídeo
              </h3>
              <p className="text-gray-600 mb-4">
                Envie seu vídeo e deixe nossa IA fazer a mágica
              </p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Upload Vídeo
              </button>
            </motion.div>

            {/* Recent Videos */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📺 Vídeos Recentes
              </h3>
              <div className="space-y-3">
                {videos.slice(0, 3).map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600">📹</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      video.status === 'completed' ? 'bg-green-100 text-green-800' :
                      video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                ))}
                {videos.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum vídeo encontrado
                  </p>
                )}
              </div>
              <button className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Ver todos os vídeos →
              </button>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔗 Links Rápidos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/app/videos" className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-center">
                <div className="text-2xl mb-2">📹</div>
                <p className="text-sm font-medium text-gray-900">Vídeos</p>
              </a>
              <a href="/app/analytics" className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium text-gray-900">Analytics</p>
              </a>
              <a href="/app/billing" className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-center">
                <div className="text-2xl mb-2">💳</div>
                <p className="text-sm font-medium text-gray-900">Faturas</p>
              </a>
              <a href="/app/settings" className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-medium text-gray-900">Configurações</p>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard