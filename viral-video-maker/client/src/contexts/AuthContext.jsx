import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Validar token e obter usuário
      authService.getCurrentUser()
        .then(user => {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        })
        .catch(error => {
          localStorage.removeItem('token')
          dispatch({ type: 'LOGIN_ERROR', payload: error.message })
        })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authService.login(email, password)
      localStorage.setItem('token', response.token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authService.register(userData)
      localStorage.setItem('token', response.token)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  const value = {
    ...state,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}