import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Shield, CheckCircle, Flame } from 'lucide-react'
import { useAppContext } from '../App'
import norteGasLogo from '../assets/Nortegas-logo.png'

const EmailVerification = () => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { pendingVerification, setUser, setIsAuthenticated, setPoints, setPendingVerification } = useAppContext()
  const navigate = useNavigate()

  // Si el usuario ya está auto-verificado, mostrar éxito inmediatamente
  useEffect(() => {
    if (pendingVerification?.autoVerified) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/home')
      }, 2000)
    }
  }, [pendingVerification, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!code) {
      setError('Por favor ingresa el código de verificación')
      setLoading(false)
      return
    }

    // Simulación de verificación para usuarios que no están auto-verificados
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (code === pendingVerification?.code) {
      setSuccess(true)
      
      // Simular creación exitosa de cuenta
      setTimeout(() => {
        const userData = {
          email: pendingVerification.userData.email,
          name: `${pendingVerification.userData.nombre} ${pendingVerification.userData.apellido}`,
          id: Date.now(),
          ...pendingVerification.userData
        }
        
        setUser(userData)
        setIsAuthenticated(true)
        setPoints(100) // Puntos de bienvenida
        setPendingVerification(null)
        navigate('/home')
      }, 2000)
    } else {
      setError('Código incorrecto. Por favor verifica e intenta nuevamente.')
    }
    
    setLoading(false)
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')
    
    // Simular reenvío de código
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generar nuevo código
    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    setPendingVerification(prev => ({
      ...prev,
      code: newCode
    }))
    
    setLoading(false)
    alert(`Nuevo código enviado: ${newCode} (Solo para demo)`)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <Card className="w-full max-w-md text-center border-blue-100">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <img 
                src={norteGasLogo} 
                alt="NorteGAS" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido a NorteGAS!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido creada exitosamente. Serás redirigido en breve...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md border-blue-100">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={norteGasLogo} 
              alt="NorteGAS" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verifica tu Email
          </CardTitle>
          <CardDescription>
            Hemos enviado un código de 6 dígitos a<br />
            <strong>{pendingVerification?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
                  maxLength="6"
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
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verificar Código
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              ¿No recibiste el código?
            </p>
            <Button 
              variant="outline" 
              onClick={handleResendCode}
              disabled={loading}
              className="text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Reenviar Código
            </Button>
          </div>

          {/* Solo para demo - mostrar el código */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center flex items-center justify-center">
              <Flame className="mr-1 h-3 w-3" />
              <strong>Demo NorteGAS:</strong> Código actual: {pendingVerification?.code}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerification

