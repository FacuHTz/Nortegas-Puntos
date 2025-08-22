import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Truck, Percent, Coffee, Crown, CheckCircle, AlertCircle, Flame, MessageCircle } from 'lucide-react'
import GarrafaIcon from './GarrafaIcon';
import { useAppContext } from '../App'
import pointsService from '../services/points'
import norteGasLogo from '../assets/Nortegas-logo.png'

const RedeemPoints = () => {
  const navigate = useNavigate();
  const { points, setPoints } = useAppContext();
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState({ name: '', address: '' });
  const [redeemResult, setRedeemResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const rewards = [
    {
      id: 'envio_gratis',
      title: 'Envío Gratis',
      description: 'Delivery gratuito de tu próxima garrafa',
      points: 500,
      icon: Truck,
      color: 'from-green-500 to-green-600',
      available: points >= 500,
      requiresOrder: true
    },
    {
      id: 'descuento_5000',
      title: 'Descuento $5000',
      description: 'Descuento en la compra de garrafa',
      points: 2500,
      icon: Percent,
      color: 'from-orange-500 to-orange-600',
      available: points >= 2500,
      requiresOrder: true
    },
    {
      id: 'taza_nortegas',
      title: 'Taza NorteGAS',
      description: 'Taza exclusiva con logo de NorteGAS',
      points: 1500,
      icon: Coffee,
      color: 'from-blue-500 to-blue-600',
      available: points >= 1500,
      requiresOrder: false
    },
    {
      id: 'gorra-nortegas',
      title: 'Gorra NorteGAS',
      description: 'Gorra oficial con bordado NorteGAS',
      points: 1500,
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      available: points >= 1500
    }
  ];

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setShowConfirmDialog(true);
  };

    const confirmRedeem = async () => {
    if (!selectedReward) return;

    // Si es envío gratis o descuento, mostrar modal de pedido
    if (selectedReward.id === 'envio_gratis' || selectedReward.id === 'descuento_5000') {
      setShowConfirmDialog(false);
      setShowOrderModal(true);
      return;
    }

    setLoading(true);
    try {
      const rewardData = {
        premio_id: selectedReward.id,
        premio_nombre: selectedReward.title,
        puntos_requeridos: selectedReward.points,
        nombre_entrega: orderData.name || '',
        direccion_entrega: orderData.address || ''
      };

      const response = await pointsService.redeemReward(rewardData);
      
      setPoints(response.puntos_restantes);
      setRedeemResult({
        success: true,
        reward: selectedReward,
        message: response.message
      });
    } catch (error) {
      setRedeemResult({
        success: false,
        message: error.message
      });
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
      setSelectedReward(null);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleOrderSubmit = async () => {
    if (!orderData.name.trim() || !orderData.address.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const rewardData = {
        premio_id: selectedReward.id,
        premio_nombre: selectedReward.title,
        puntos_requeridos: selectedReward.points,
        nombre_entrega: orderData.name,
        direccion_entrega: orderData.address
      };

      const response = await pointsService.redeemReward(rewardData);
      
      // Actualizar puntos en el contexto
      setPoints(response.puntos_restantes);

      // Crear mensaje para WhatsApp
      const phoneNumber = '5493436214609';
      const canjeType = selectedReward.id === 'envio_gratis' ? 'Envío Gratis' : 'Descuento $5000';
      const solicitud = selectedReward.id === 'envio_gratis' 
        ? 'Solicito delivery gratuito de garrafa' 
        : 'Solicito garrafa con descuento de $5000';
      
      const message = 'CANJE NORTEGAS PUNTOS - ' + canjeType + ' - Nombre: ' + orderData.name + ' - Dirección: ' + orderData.address + ' - Puntos: ' + selectedReward.points + ' - ' + solicitud;

      const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Mostrar resultado exitoso
      setRedeemResult({
        success: true,
        reward: selectedReward,
        message: response.message + ' Te redirigimos a WhatsApp para completar tu pedido.'
      });

      // Limpiar estados
      setShowOrderModal(false);
      setSelectedReward(null);
      setOrderData({ name: '', address: '' });
      
    } catch (error) {
      setRedeemResult({
        success: false,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Canjear Puntos</h1>
            <p className="text-gray-600">Intercambia tus puntos por increíbles premios</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Current Points Display */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <Flame className="mr-3 h-6 w-6" />
              <GarrafaIcon size={32} className="mr-3 text-white" />
              <div className="text-center">
                <p className="text-sm opacity-90">Tus Puntos NorteGAS</p>
                <p className="text-3xl font-bold">{points}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success/Error Message */}
        {redeemResult && (
          <Card className={`border-2 ${redeemResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center">
                {redeemResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                )}
                <p className={`${redeemResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {redeemResult.message}
                </p>
              </div>
              {redeemResult.success && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">
                    Te contactaremos pronto para coordinar la entrega de tu premio.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const IconComponent = reward.icon;
            return (
              <Card 
                key={reward.id} 
                className={`border-2 transition-all duration-200 hover:shadow-lg ${
                  reward.available 
                    ? 'border-blue-200 hover:border-blue-300' 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${reward.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{reward.points}</p>
                      <p className="text-sm text-gray-500">puntos</p>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full ${
                      reward.available 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!reward.available}
                    onClick={() => handleRedeemClick(reward)}
                  >
                    {reward.available ? 'Canjear' : 'Puntos insuficientes'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 flex items-center">
              <Flame className="mr-2 h-5 w-5" />
              ¿Cómo funciona el canje?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-gray-700">Acumula puntos comprando garrafas y usando códigos promocionales</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-gray-700">Elige el premio que más te guste y verifica que tienes suficientes puntos</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-gray-700">Confirma el canje y nos contactaremos contigo para la entrega</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Modal for Delivery/Discount */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-blue-600" />
              Datos para tu Pedido
            </DialogTitle>
            <DialogDescription>
              {selectedReward && (
                <div className="space-y-4">
                  <p>Completa tus datos para procesar el pedido:</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-blue-800">{selectedReward.title}</h3>
                    <p className="text-blue-600">{selectedReward.description}</p>
                    <p className="text-blue-800 font-bold mt-2">{selectedReward.points} puntos</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={orderData.name}
                onChange={(e) => setOrderData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Dirección de Entrega</Label>
              <Input
                id="address"
                placeholder="Dirección completa para la entrega"
                value={orderData.address}
                onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                📱 Al confirmar, te redirigiremos a WhatsApp con todos los datos del pedido para que NorteGAS pueda procesarlo.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowOrderModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleOrderSubmit} className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar a WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Canje</DialogTitle>
            <DialogDescription>
              {selectedReward && (
                <div className="space-y-4">
                  <p>¿Estás seguro que quieres canjear:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg">{selectedReward.title}</h3>
                    <p className="text-gray-600">{selectedReward.description}</p>
                    <p className="text-blue-600 font-bold mt-2">{selectedReward.points} puntos</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Después del canje tendrás {points - selectedReward.points} puntos restantes.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmRedeem} className="bg-blue-600 hover:bg-blue-700">
              Confirmar Canje
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedeemPoints;

