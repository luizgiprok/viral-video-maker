import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Edição Inteligente',
      description: 'Nossa IA faz a edição automática do seu vídeo'
    },
    {
      icon: '📱',
      title: 'Multiplataforma',
      description: 'Otimizado para YouTube, TikTok, Instagram e mais'
    },
    {
      icon: '⚡',
      title: 'Processamento Rápido',
      description: 'Vídeos processados em minutos, não horas'
    },
    {
      icon: '📊',
      title: 'Analytics em Tempo Real',
      description: 'Acompanhe o desempenho dos seus vídeos'
    }
  ]

  const pricingPlans = [
    {
      name: 'Básico',
      price: '€9.99',
      period: '/mês',
      description: 'Perfeito para iniciantes',
      features: ['10 vídeos/mês', 'Edição básica', 'Suporte por email', '720p'],
      popular: false
    },
    {
      name: 'Profissional',
      price: '€29.99',
      period: '/mês',
      description: 'Para empresas que precisam de mais',
      features: ['100 vídeos/mês', 'Edição avançada', 'Suporte prioritário', '1080p', 'Templates premium'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '€99.99',
      period: '/mês',
      description: 'Solução completa',
      features: ['Vídeos ilimitados', 'Edição profissional', 'Suporte 24/7', '4K', 'API access'],
      popular: false
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-6xl mb-6"
          >
            🎥
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Vídeos Virais com IA
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma SaaS que transforma seus vídeos em conteúdo otimizado para YouTube e TikTok. 
            Edição automática, upload inteligente e analytics em tempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/app/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              🚀 Começar Agora
            </Link>
            <Link
              to="/app/login"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              🔑 Fazer Login
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">500K+</div>
              <div className="text-gray-600">Vídeos Processados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-600">Suporte</div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos para Cada Necessidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano perfeito para sua empresa e comece a criar vídeos virais hoje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-xl border-2 ${
                  plan.popular
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl'
                    : 'border-gray-200 bg-white shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">
                      {plan.period}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center text-gray-600">
                        <span className="mr-2 text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/app/register"
                    className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Transformar Seus Vídeos?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de criadores e empresas que estão usando nossa plataforma para criar conteúdo viral.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              🎯 Começar Grátis
            </Link>
            <Link
              to="/demo"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              🎬 Ver Demonstração
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero