import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Star, Plus, LogOut, Gift, Coins, Flame } from 'lucide-react'
import GarrafaIcon from './GarrafaIcon';
import { useAppContext } from '../App'
import pointsService from '../services/points'
import authService from '../services/auth'
import norteGasLogo from '../assets/Nortegas-logo.png'

const Home = () => {
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, points, setIsAuthenticated, setUser, setPoints } = useAppContext()
  const navigate = useNavigate()

  // Sincronizar puntos al cargar el componente
  useEffect(() => {
    const syncUserPoints = async () => {
      try {
        setLoading(true)
        const response = await pointsService.getUserPoints()
        setPoints(response.puntos_actuales)
        
        // Actualizar datos del usuario si es necesario
        if (response.usuario) {
          setUser(prev => ({ ...prev, ...response.usuario }))
        }
      } catch (error) {
        console.error('Error al sincronizar puntos:', error)
        // Si hay error de autenticación, redirigir al login
        if (error.message.includes('Token') || error.message.includes('autenticado')) {
          handleLogout()
        }
      } finally {
        setLoading(false)
      }
    }

    syncUserPoints()
  }, [setPoints, setUser])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      setPoints(0)
      navigate('/login')
    }
  }

  const handleLoadCode = () => {
    navigate('/load-code')
  }

  const handleRedeemPoints = () => {
    navigate('/redeem-points')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={norteGasLogo} 
              alt="NorteGAS" 
              className="h-12 w-auto object-contain mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Hola, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">Bienvenido a NorteGAS Puntos</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Points Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <Flame className="mr-2 h-5 w-5" />
                  Tus Puntos NorteGAS
                </h2>
                <div className="flex items-center">
                  <Coins className="mr-2 h-8 w-8" />
                  <span className="text-4xl font-bold">{points}</span>
                </div>
              </div>
              <div className="text-right">
                <GarrafaIcon size={48} className="text-white/30" />            </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cargar Código</h3>
                  <p className="text-sm text-gray-600">Ingresa un código para sumar puntos</p>
                </div>
              </div>
              <Button 
                onClick={handleLoadCode}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Cargá un código
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Canjear Puntos</h3>
                  <p className="text-sm text-gray-600">Intercambia puntos por premios</p>
                </div>
              </div>
              <Button 
                onClick={handleRedeemPoints}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Canjear Puntos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ver Detalles</h3>
                  <p className="text-sm text-gray-600">Información completa de tus puntos</p>
                </div>
              </div>
              <Dialog open={showPointsModal} onOpenChange={setShowPointsModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    Ver Puntos
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Flame className="mr-2 h-5 w-5 text-blue-600" />
                      Resumen de Puntos NorteGAS
                    </DialogTitle>
                    <DialogDescription>
                      Aquí tienes el detalle de tus puntos acumulados
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <div className="flex items-center justify-center">
                        <Coins className="mr-3 h-12 w-12 text-blue-600" />
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900">{points}</p>
                          <p className="text-sm text-gray-600">Puntos Totales</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Puntos de bienvenida</span>
                        <span className="font-medium text-blue-600">+50</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">Códigos canjeados</span>
                        <span className="font-medium text-blue-600">+{points - 50}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 font-semibold">
                        <span>Total</span>
                        <span className="text-blue-600">{points} puntos</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5 text-blue-600" />
              ¿Cómo funciona NorteGAS Puntos?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Obtén códigos</h4>
                  <p className="text-sm text-gray-600">Consigue códigos de promociones y eventos NorteGAS</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Carga tu código</h4>
                  <p className="text-sm text-gray-600">Ingresa el código en la sección correspondiente</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3 mt-1">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Acumula puntos</h4>
                  <p className="text-sm text-gray-600">Suma puntos y canjéalos por beneficios exclusivos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home

