import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Components
import Button from '../components/Button'
import Input from '../components/Input'
import Checkbox from '../components/Checkbox'

const Login = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Login realizado com sucesso!')
      navigate('/app/dashboard')
    } catch (error) {
      toast.error('Erro ao realizar login')
    }
  }

  return (
    <>
      <Helmet>
        <title>Login - Viral Video Maker</title>
        <meta name="description" content="Faça login na sua conta do Viral Video Maker" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Faça seu login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                crie uma nova conta
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  error={errors.email}
                />
              </div>

              <div>
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres'
                    }
                  })}
                  error={errors.password}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}

export default Login