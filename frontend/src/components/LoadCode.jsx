import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Gift, CheckCircle, Coins, Flame, XCircle } from 'lucide-react'
import GarrafaIcon from './GarrafaIcon';
import { useAppContext } from '../App'
import pointsService from '../services/points'
import norteGasLogo from '../assets/Nortegas-logo.png'
const validCodes = {
  'PROMO2024': 50,
  'BIENVENIDA': 25,
  'EVENTO10': 10,
  'SUPERGAS': 100
}
const LoadCode = () => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  
  const { points, setPoints } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    if (!code.trim()) {
      setError('Por favor ingresa un código')
      setLoading(false)
      return
    }

    try {
      const response = await pointsService.redeemCode(code.trim().toUpperCase())
      
      // Actualizar puntos en el contexto
      setPoints(response.puntos_actuales)
      
      // Mostrar resultado exitoso
      setResult({
        success: true,
        message: response.message,
        pointsEarned: response.puntos_ganados,
        newTotal: response.puntos_actuales
      })
      
      // Limpiar el código
      setCode('')
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mr-4 text-blue-600 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <img 
            src={norteGasLogo} 
            alt="NorteGAS" 
            className="h-10 w-auto object-contain mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cargar Código</h1>
            <p className="text-gray-600">Ingresa tu código NorteGAS para sumar puntos</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Current Points Display */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <Flame className="mr-3 h-6 w-6" />
              <GarrafaIcon size={32} className="mr-3 text-white" />
              <div className="text-center">
                <p className="text-sm opacity-90">Puntos Actuales</p>
                <p className="text-3xl font-bold">{points}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Input Form */}
        <Card className="border-blue-100">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit mb-4">
              <Gift className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Ingresa tu Código NorteGAS
            </CardTitle>
            <CardDescription>
              Escribe el código que recibiste para sumar puntos a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Promoción</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Ingresa tu código aquí"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center text-lg tracking-wider uppercase focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              {result && (
                <div className={`p-4 rounded-lg text-center ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center mb-2">
                    {result.success ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <p className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.success && (
                    <div className="mt-2">
                      <Button 
                        onClick={handleBack}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Volver al Inicio
                      </Button>
                    </div>
                  )}
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
                    Validando código...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Gift className="mr-2 h-4 w-4" />
                    Enviar Código
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Example Codes for Demo */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Flame className="mr-2 h-5 w-5 text-blue-600" />
              Códigos de Ejemplo NorteGAS
            </CardTitle>
            <CardDescription>
              Puedes probar con estos códigos para la demostración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(validCodes).map(([codeKey, pointValue]) => (
                <div 
                  key={codeKey}
                  className="bg-blue-50 p-3 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100"
                  onClick={() => setCode(codeKey)}
                >
                  <p className="font-mono font-bold text-sm text-blue-800">{codeKey}</p>
                  <p className="text-xs text-blue-600">+{pointValue} puntos</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoadCode

