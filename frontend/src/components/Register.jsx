import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Lock, Calendar, MapPin, CreditCard, UserPlus } from 'lucide-react'
import { useAppContext } from '../App'
import authService from '../services/auth'
import norteGasLogo from '../assets/Nortegas-logo.png'

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    domicilio: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { setPendingVerification, setUser, setIsAuthenticated, setPoints } = useAppContext()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.dni || 
        !formData.domicilio || !formData.fechaNacimiento || 
        !formData.email || !formData.password) {
      return 'Todos los campos son obligatorios'
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    
    if (formData.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!/^\d{7,8}$/.test(formData.dni)) {
      return 'El DNI debe tener 7 u 8 dígitos'
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Preparar datos para la API
      const userData = {
        username: `${formData.nombre}.${formData.apellido}`.toLowerCase(), // <-- NUEVO
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        nombre_completo: `${formData.nombre} ${formData.apellido}`,
        dni: formData.dni,
        domicilio: formData.domicilio,
        fecha_nacimiento: formData.fechaNacimiento
      }

      const response = await authService.register(userData)
      
      // El backend ya marca el email como verificado, así que podemos ir directo al home
      setUser(response.user)
      setIsAuthenticated(true)
      setPoints(response.user.puntos_actuales)
      
      // Simular código de verificación para mantener el flujo UX
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      setPendingVerification({
        email: formData.email,
        code: verificationCode,
        userData: formData,
        autoVerified: true // Flag para indicar que ya está verificado
      })
      
      navigate('/verify-email')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={norteGasLogo} 
              alt="NorteGAS" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Únete a NorteGAS
          </CardTitle>
          <CardDescription>
            Crea tu cuenta y comienza a acumular puntos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="apellido"
                    name="apellido"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dni"
                    name="dni"
                    type="text"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    maxLength="8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domicilio">Domicilio</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="domicilio"
                  name="domicilio"
                  type="text"
                  placeholder="Tu dirección completa"
                  value={formData.domicilio}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
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
                  Creando cuenta...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Cuenta
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
  }

export default Register

