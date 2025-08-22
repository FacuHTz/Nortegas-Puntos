import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import EmailVerification from './components/EmailVerification'
import Home from './components/Home'
import LoadCode from './components/LoadCode'
import RedeemPoints from './components/RedeemPoints'
import authService from './services/auth'
import './App.css'

// Context para manejar el estado global de la aplicación
const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de AppProvider')
  }
  return context
}

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [points, setPoints] = useState(0)
  const [pendingVerification, setPendingVerification] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser()
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
            setPoints(userData.puntos_actuales || 0)
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        authService.logout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const contextValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    points,
    setPoints,
    pendingVerification,
    setPendingVerification
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} 
            />
            <Route 
              path="/verify-email" 
              element={pendingVerification ? <EmailVerification /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/home" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/load-code" 
              element={isAuthenticated ? <LoadCode /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/redeem-points" 
              element={isAuthenticated ? <RedeemPoints /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App

