import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Recursos', href: '/features' },
      { name: 'Preços', href: '/pricing' },
      { name: 'Integrações', href: '/integrations' },
      { name: 'Documentação', href: '/docs' }
    ],
    company: [
      { name: 'Sobre nós', href: '/about' },
      { name: 'Carreiras', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' }
    ],
    support: [
      { name: 'Central de Ajuda', href: '/help' },
      { name: 'Contato', href: '/contact' },
      { name: 'Status', href: '/status' },
      { name: 'API', href: '/api' }
    ],
    legal: [
      { name: 'Termos de Uso', href: '/terms' },
      { name: 'Política de Privacidade', href: '/privacy' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'Licenças', href: '/licenses' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/viralvideomaker' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/viralvideomaker' },
    { name: 'GitHub', icon: '💻', href: 'https://github.com/viralvideomaker' },
    { name: 'Discord', icon: '💬', href: 'https://discord.gg/viralvideomaker' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo e Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl mr-3"
              >
                🎥
              </motion.div>
              <span className="text-xl font-bold">Viral Video Maker</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Plataforma SaaS completa para criação automática de vídeos virais otimizados para YouTube e TikTok.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <span>{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Produto
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Suporte
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm">
            © 2024 Viral Video Maker. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer