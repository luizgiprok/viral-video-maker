import React from 'react'
import { motion } from 'framer-motion'

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Edição Inteligente',
      description: 'Nossa IA faz a edição automática do seu vídeo, cortes, melhorias e otimizações.',
      color: 'bg-blue-100'
    },
    {
      icon: '📱',
      title: 'Multiplataforma',
      description: 'Otimizado automaticamente para YouTube, TikTok, Instagram e outras redes.',
      color: 'bg-green-100'
    },
    {
      icon: '⚡',
      title: 'Processamento Rápido',
      description: 'Vídeos processados em minutos, não horas. Tecnologia de ponta para máxima performance.',
      color: 'bg-yellow-100'
    },
    {
      icon: '📊',
      title: 'Analytics em Tempo Real',
      description: 'Acompanhe o desempenho dos seus vídeos com métricas detalhadas e insights.',
      color: 'bg-purple-100'
    },
    {
      icon: '🎯',
      title: 'Conteúdo Viral',
      description: 'Algoritmos avançados analisam tendências e otimizam seu conteúdo para viralizar.',
      color: 'bg-red-100'
    },
    {
      icon: '🔒',
      title: 'Segurança Total',
      description: 'Seus vídeos e dados estão protegidos com criptografia de nível empresarial.',
      color: 'bg-indigo-100'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Recursos Poderosos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Tudo que você precisa para criar conteúdo viral de profissional em minutos
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            Pronto para Transformar Seu Conteúdo?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Junte-se a milhares de criadores que estão usando nossa plataforma para alcançar milhões de views.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Começar Agora
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default Features