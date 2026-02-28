import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const Videos = () => {
  const mockVideos = [
    {
      id: 1,
      title: 'Vídeo de Produto Demo',
      status: 'completed',
      duration: '2:30',
      size: '45MB',
      platforms: ['youtube', 'tiktok'],
      createdAt: '2024-01-15',
      views: 1250
    },
    {
      id: 2,
      title: 'Tutorial de Marketing',
      status: 'processing',
      duration: '5:00',
      size: '78MB',
      platforms: ['youtube'],
      createdAt: '2024-01-14',
      views: 0
    },
    {
      id: 3,
      title: 'Campanha Promocional',
      status: 'failed',
      duration: '1:15',
      size: '23MB',
      platforms: ['tiktok', 'instagram'],
      createdAt: '2024-01-13',
      views: 890
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Helmet>
        <title>Vídeos - Viral Video Maker</title>
        <meta name="description" content="Gerencie seus vídeos processados" />
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
            <h1 className="text-3xl font-bold text-gray-900">Meus Vídeos</h1>
            <p className="mt-2 text-gray-600">
              Gerencie todos os seus vídeos processados
            </p>
          </motion.div>

          {/* Upload Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
              <span className="mr-2">📤</span>
              Novo Upload
            </button>
          </motion.div>

          {/* Videos Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vídeo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plataformas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visualizações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockVideos.map((video, index) => (
                    <motion.tr
                      key={video.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600">📹</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{video.title}</div>
                            <div className="text-sm text-gray-500">ID: {video.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {video.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {video.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-1">
                          {video.platforms.map((platform) => (
                            <span key={platform} className="px-2 py-1 text-xs bg-gray-100 rounded">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {video.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Ver
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Deletar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex items-center justify-between"
          >
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de{' '}
              <span className="font-medium">3</span> vídeos
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Videos