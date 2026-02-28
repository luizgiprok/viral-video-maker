import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

const Upload = () => {
  const onDrop = (acceptedFiles) => {
    console.log('Arquivos aceitos:', acceptedFiles)
    // Aqui você enviaria os arquivos para o backend
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/x-matroska': ['.mkv'],
      'video/webm': ['.webm']
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: true
  })

  const mockPlatforms = [
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-100' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-100' }
  ]

  const mockOptions = [
    { id: 'auto-edit', name: 'Edição automática', description: 'Nossa IA fará a edição inteligente' },
    { id: 'add-music', name: 'Adicionar música', description: 'Música royalty-free' },
    { id: 'add-subtitles', name: 'Adicionar legendas', description: 'Legendas automáticas' },
    { id: 'optimize-for', name: 'Otimizar para', description: 'Melhor formato para cada plataforma' },
    { id: 'watermark', name: 'Adicionar marca d\'água', description: 'Proteja seu conteúdo' },
    { id: 'thumbnail', name: 'Gerar thumbnail', description: 'Thumbnail otimizada' }
  ]

  return (
    <>
      <Helmet>
        <title>Upload de Vídeo - Viral Video Maker</title>
        <meta name="description" content="Envie seu vídeo e deixe nossa IA fazer a mágica" />
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
            <h1 className="text-3xl font-bold text-gray-900">Upload de Vídeo</h1>
            <p className="mt-2 text-gray-600">
              Envie seu vídeo e deixe nossa IA fazer a mágica
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Envie seu vídeo
                </h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {isDragActive ? (
                    <p className="text-indigo-600">Solte os arquivos aqui...</p>
                  ) : (
                    <div>
                      <div className="text-4xl mb-4">📹</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Arraste e solte seus vídeos aqui
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        ou clique para selecionar arquivos
                      </p>
                      <p className="text-xs text-gray-500">
                        Formatos suportados: MP4, MOV, AVI, MKV, WebM (máx. 500MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* File List */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Arquivos selecionados
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📹</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">video_demo.mp4</p>
                          <p className="text-xs text-gray-500">45.2 MB • 2:30</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Video Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalhes do Vídeo
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Digite o título do vídeo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Digite a descrição do vídeo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="marketing, tutorial, dica"
                    />
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Plataformas
                </h2>
                
                <div className="space-y-3">
                  {mockPlatforms.map((platform) => (
                    <label key={platform.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <div className={`ml-3 flex items-center px-3 py-1 rounded-full ${platform.color}`}>
                        <span className="text-white mr-2">{platform.icon}</span>
                        <span className="text-sm font-medium text-white">{platform.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Opções de Edição
                </h2>
                
                <div className="space-y-3">
                  {mockOptions.map((option) => (
                    <label key={option.id} className="flex items-start">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{option.name}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium">
                🚀 Iniciar Processamento
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Upload