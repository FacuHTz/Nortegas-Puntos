import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAppContext } from '../App'
import authService from '../services/auth'
import norteGasLogo from '../assets/Nortegas-logo.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { setUser, setIsAuthenticated, setPoints } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        throw new Error('Por favor completa todos los campos')
      }

      const response = await authService.login(email, password)
      
      // Actualizar contexto de la aplicación
      setUser(response.user)
      setIsAuthenticated(true)
      setPoints(response.user.puntos_actuales)
      
      // Navegar a la pantalla principal
      navigate('/home')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={norteGasLogo} 
              alt="NorteGAS" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Iniciar Sesión
          </CardTitle>
          <CardDescription>
            Accede a tu cuenta de puntos NorteGAS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

