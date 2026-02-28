import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-4xl mb-4"
            >
              🎥
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Viral Video Maker
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crie vídeos virais com IA
          </p>
        </motion.div>

        {/* Auth Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          {children}
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            {children.type.name === 'Login' ? (
              <>
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Cadastre-se
                </Link>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Faça login
                </Link>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout