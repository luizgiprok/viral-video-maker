import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/app/videos', label: 'Vídeos', icon: '📹' },
    { path: '/app/upload', label: 'Upload', icon: '📤' },
    { path: '/app/analytics', label: 'Analytics', icon: '📈' },
    { path: '/app/billing', label: 'Faturas', icon: '💳' },
    { path: '/app/settings', label: 'Configurações', icon: '⚙️' }
  ]
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl mr-2"
              >
                🎥
              </motion.div>
              <span className="text-xl font-bold text-gray-900">
                Viral Video Maker
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                🔔
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                👤
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar