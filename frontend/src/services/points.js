import apiService from './api.js';

class PointsService {
  // Obtener puntos actuales del usuario
  async getUserPoints() {
    try {
      const response = await apiService.get('/user/points');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener puntos');
    }
  }

  // Obtener historial de puntos
  async getPointsHistory() {
    try {
      const response = await apiService.get('/user/history');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener historial');
    }
  }

  // Canjear código promocional
  async redeemCode(code) {
    try {
      const response = await apiService.post('/codes/redeem', { codigo: code });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al canjear código');
    }
  }

  // Canjear premio
  async redeemReward(rewardType, additionalData = {}) {
    try {
      const response = await apiService.post('/rewards/redeem', {
        tipo_premio: rewardType,
        ...additionalData
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al canjear premio');
    }
  }

  // Obtener historial de canjes
  async getRewardsHistory() {
    try {
      const response = await apiService.get('/rewards/history');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener historial de canjes');
    }
  }

  // Obtener códigos promocionales disponibles (para admin)
  async getAvailableCodes() {
    try {
      const response = await apiService.get('/codes/available');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener códigos disponibles');
    }
  }
}

// Instancia singleton
const pointsService = new PointsService();

export default pointsService;

