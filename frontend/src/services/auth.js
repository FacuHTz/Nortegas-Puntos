import apiService from './api.js';

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData, { auth: false });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  // Iniciar sesión
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password }, { auth: false });
      
      if (response.token) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Verificar token
  async verifyToken() {
    try {
      const response = await apiService.post('/auth/verify-token');
      return response;
    } catch (error) {
      // Si el token es inválido, limpiar localStorage
      this.logout();
      throw new Error(error.message || 'Token inválido');
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      // Intentar logout en el servidor
      await apiService.post('/auth/logout');
    } catch (error) {
      console.warn('Error al hacer logout en servidor:', error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Obtener datos del usuario actual
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Actualizar datos del usuario en localStorage
  updateUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

// Instancia singleton
const authService = new AuthService();

export default authService;

