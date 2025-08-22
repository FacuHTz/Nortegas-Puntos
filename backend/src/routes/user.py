from flask import Blueprint, jsonify, request
from src.models.user import User, db
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        logger.info("=== INICIANDO GET /users ===")
        
        # Obtener todos los usuarios de la tabla 'user'
        users = User.query.all()
        logger.info(f"Usuarios encontrados: {len(users)}")
        
        # Convertir a formato JSON usando to_dict()
        result = [user.to_dict() for user in users]
        
        logger.info(f"=== RESPUESTA: {len(result)} usuarios ===")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"ERROR en GET /users: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Error interno: {str(e)}'}), 500

@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        logger.info("=== INICIANDO POST /users ===")
        data = request.json
        logger.info(f"Datos recibidos: {data}")
        
        # Validar datos requeridos
        if not data.get('email') or not data.get('username'):
            logger.error("Faltan datos requeridos")
            return jsonify({'error': 'Email y username son requeridos'}), 400
        
        # Verificar si el email ya existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            logger.error(f"Email ya existe: {data['email']}")
            return jsonify({'error': 'El email ya está registrado'}), 400
        
        # Verificar si el username ya existe
        existing_username = User.query.filter_by(username=data['username']).first()
        if existing_username:
            logger.error(f"Username ya existe: {data['username']}")
            return jsonify({'error': 'El username ya está registrado'}), 400
        
        # Crear usuario simple
        user = User(
            username=data['username'],
            email=data['email']
        )
        
        logger.info(f"Usuario creado en memoria: {user.username}")
        
        # Guardar en BD
        db.session.add(user)
        logger.info("Usuario añadido a sesión")
        
        db.session.commit()
        logger.info("Commit realizado")
        
        # Verificar que se guardó
        saved_user = User.query.filter_by(email=data['email']).first()
        if saved_user:
            logger.info(f"Usuario verificado en BD: ID={saved_user.id}")
        else:
            logger.error("Usuario NO encontrado después del commit")
        
        # Contar usuarios totales
        total_users = User.query.count()
        logger.info(f"Total usuarios después de crear: {total_users}")
        
        response_data = user.to_dict()
        response_data['message'] = 'Usuario creado exitosamente'
        
        logger.info(f"=== RESPUESTA POST: {response_data} ===")
        return jsonify(response_data), 201
        
    except Exception as e:
        logger.error(f"ERROR en POST /users: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': f'Error al crear usuario: {str(e)}'}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        logger.info(f"=== GET /users/{user_id} ===")
        user = User.query.get_or_404(user_id)
        logger.info(f"Usuario encontrado: {user.username}")
        
        return jsonify(user.to_dict())
    except Exception as e:
        logger.error(f"ERROR en GET /users/{user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        logger.info(f"=== PUT /users/{user_id} ===")
        user = User.query.get_or_404(user_id)
        data = request.json
        logger.info(f"Datos para actualizar: {data}")
        
        if 'email' in data:
            # Verificar que el nuevo email no esté en uso
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'El email ya está en uso'}), 400
            user.email = data['email']
            
        if 'username' in data:
            # Verificar que el nuevo username no esté en uso
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'El username ya está en uso'}), 400
            user.username = data['username']
        
        db.session.commit()
        logger.info("Usuario actualizado exitosamente")
        
        response_data = user.to_dict()
        response_data['message'] = 'Usuario actualizado exitosamente'
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"ERROR en PUT /users/{user_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error al actualizar usuario: {str(e)}'}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        logger.info(f"=== DELETE /users/{user_id} ===")
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        logger.info("Usuario eliminado exitosamente")
        
        return jsonify({'message': 'Usuario eliminado exitosamente'}), 200
        
    except Exception as e:
        logger.error(f"ERROR en DELETE /users/{user_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Error al eliminar usuario: {str(e)}'}), 500
