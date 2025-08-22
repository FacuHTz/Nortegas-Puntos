from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db, User, CodigoPromocional, HistorialPuntos, CanjeRealizado
from src.routes.auth import verify_token

points_bp = Blueprint('points', __name__)

def require_auth(f):
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token de autorización requerido'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Token inválido o expirado'}), 401
        
        user = User.query.get(user_id)
        if not user or not user.activo:
            return jsonify({'error': 'Usuario no encontrado o desactivado'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

@points_bp.route('/user/points', methods=['GET'])
@require_auth
def get_user_points():
    try:
        user = request.current_user
        return jsonify({
            'puntos_actuales': user.puntos_actuales,
            'usuario': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@points_bp.route('/user/history', methods=['GET'])
@require_auth
def get_user_history():
    try:
        user = request.current_user
        historial = HistorialPuntos.query.filter_by(usuario_id=user.id).order_by(HistorialPuntos.fecha_operacion.desc()).all()
        
        return jsonify({
            'historial': [h.to_dict() for h in historial]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@points_bp.route('/codes/redeem', methods=['POST'])
@require_auth
def redeem_code():
    try:
        data = request.get_json()
        codigo_texto = data.get('codigo', '').strip().upper()
        
        if not codigo_texto:
            return jsonify({'error': 'Código requerido'}), 400
        
        user = request.current_user
        
        # Buscar el código
        codigo = CodigoPromocional.query.filter_by(codigo=codigo_texto).first()
        if not codigo:
            return jsonify({'error': 'Código no válido'}), 400
        
        if not codigo.activo:
            return jsonify({'error': 'Código desactivado'}), 400
        
        # Verificar expiración
        if codigo.fecha_expiracion and codigo.fecha_expiracion < datetime.utcnow():
            return jsonify({'error': 'Código expirado'}), 400
        
        # Verificar límite de usos
        if codigo.usos_maximos > 0 and codigo.usos_actuales >= codigo.usos_maximos:
            return jsonify({'error': 'Código agotado'}), 400
        
        # Verificar si el usuario ya usó este código
        historial_existente = HistorialPuntos.query.filter_by(
            usuario_id=user.id,
            codigo_usado=codigo_texto
        ).first()
        
        if historial_existente:
            return jsonify({'error': 'Ya has usado este código anteriormente'}), 400
        
        # Aplicar puntos
        user.puntos_actuales += codigo.puntos_valor
        codigo.usos_actuales += 1
        
        # Registrar en historial
        historial = HistorialPuntos(
            usuario_id=user.id,
            tipo_operacion='carga',
            puntos_cantidad=codigo.puntos_valor,
            descripcion=f'Código promocional: {codigo.descripcion or codigo.codigo}',
            codigo_usado=codigo_texto
        )
        
        db.session.add(historial)
        db.session.commit()
        
        return jsonify({
            'message': f'¡Código válido! Has ganado {codigo.puntos_valor} puntos NorteGAS.',
            'puntos_ganados': codigo.puntos_valor,
            'puntos_actuales': user.puntos_actuales,
            'codigo': codigo.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@points_bp.route('/rewards/redeem', methods=['POST'])
@require_auth
def redeem_reward():
    try:
        data = request.get_json()
        premio_id = data.get('premio_id')
        premio_nombre = data.get('premio_nombre')
        puntos_requeridos = data.get('puntos_requeridos')
        nombre_entrega = data.get('nombre_entrega')
        direccion_entrega = data.get('direccion_entrega')
        
        if not all([premio_id, premio_nombre, puntos_requeridos]):
            return jsonify({'error': 'Datos del premio incompletos'}), 400
        
        user = request.current_user
        
        # Verificar puntos suficientes
        if user.puntos_actuales < puntos_requeridos:
            return jsonify({'error': 'Puntos insuficientes'}), 400
        
        # Descontar puntos
        user.puntos_actuales -= puntos_requeridos
        
        # Crear registro de canje
        canje = CanjeRealizado(
            usuario_id=user.id,
            premio_id=premio_id,
            premio_nombre=premio_nombre,
            puntos_utilizados=puntos_requeridos,
            nombre_entrega=nombre_entrega,
            direccion_entrega=direccion_entrega,
            estado='pendiente'
        )
        
        # Registrar en historial de puntos
        historial = HistorialPuntos(
            usuario_id=user.id,
            tipo_operacion='canje',
            puntos_cantidad=-puntos_requeridos,
            descripcion=f'Canje: {premio_nombre}'
        )
        
        db.session.add(canje)
        db.session.add(historial)
        db.session.commit()
        
        return jsonify({
            'message': f'¡Felicitaciones! Has canjeado {premio_nombre} por {puntos_requeridos} puntos.',
            'puntos_restantes': user.puntos_actuales,
            'canje': canje.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@points_bp.route('/rewards/history', methods=['GET'])
@require_auth
def get_rewards_history():
    try:
        user = request.current_user
        canjes = CanjeRealizado.query.filter_by(usuario_id=user.id).order_by(CanjeRealizado.fecha_canje.desc()).all()
        
        return jsonify({
            'canjes': [c.to_dict() for c in canjes]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@points_bp.route('/codes/validate', methods=['POST'])
@require_auth
def validate_code():
    try:
        data = request.get_json()
        codigo_texto = data.get('codigo', '').strip().upper()
        
        if not codigo_texto:
            return jsonify({'error': 'Código requerido'}), 400
        
        user = request.current_user
        
        # Buscar el código
        codigo = CodigoPromocional.query.filter_by(codigo=codigo_texto).first()
        if not codigo:
            return jsonify({'valid': False, 'message': 'Código no válido'}), 200
        
        if not codigo.activo:
            return jsonify({'valid': False, 'message': 'Código desactivado'}), 200
        
        # Verificar expiración
        if codigo.fecha_expiracion and codigo.fecha_expiracion < datetime.utcnow():
            return jsonify({'valid': False, 'message': 'Código expirado'}), 200
        
        # Verificar límite de usos
        if codigo.usos_maximos > 0 and codigo.usos_actuales >= codigo.usos_maximos:
            return jsonify({'valid': False, 'message': 'Código agotado'}), 200
        
        # Verificar si el usuario ya usó este código
        historial_existente = HistorialPuntos.query.filter_by(
            usuario_id=user.id,
            codigo_usado=codigo_texto
        ).first()
        
        if historial_existente:
            return jsonify({'valid': False, 'message': 'Ya has usado este código'}), 200
        
        return jsonify({
            'valid': True,
            'codigo': codigo.to_dict(),
            'message': f'Código válido. Otorga {codigo.puntos_valor} puntos.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

