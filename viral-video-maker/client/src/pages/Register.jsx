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

const Register = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Cadastro realizado com sucesso!')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao realizar cadastro')
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro - Viral Video Maker</title>
        <meta name="description" content="Crie sua conta no Viral Video Maker" />
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
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Faça login
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  label="Nome completo"
                  type="text"
                  placeholder="Digite seu nome"
                  {...register('name', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter no mínimo 2 caracteres'
                    }
                  })}
                  error={errors.name}
                />
              </div>

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

              <div>
                <Input
                  label="Confirme sua senha"
                  type="password"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value, formValues) =>
                      value === formValues.password || 'As senhas não coincidem'
                  })}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="terms"
                  {...register('terms', {
                    required: 'Você deve aceitar os termos de uso'
                  })}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Eu aceito os{' '}
                  <Link
                    to="/terms"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    to="/privacy"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link
                  to="/terms"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}

export default Register