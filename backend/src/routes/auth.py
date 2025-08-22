from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
import os
from src.models.user import db, User, HistorialPuntos
from datetime import date

auth_bp = Blueprint("auth", __name__)

SECRET_KEY = os.environ.get("SECRET_KEY", "asdf#FGSgvasgf$5$WGT")


def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),  # Token válido por 7 días
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        # Validar datos requeridos
        required_fields = [
            "email",
            "password",
            "nombre_completo",
            "dni",
            "domicilio",
            "fecha_nacimiento",
        ]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Campo {field} es requerido"}), 400

        # Verificar si el email ya existe
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "El email ya está registrado"}), 400

        # Crear nuevo usuario
        user = User(
            username=data["username"],
            email=data["email"],
            nombre=data["nombre"],
            apellido=data["apellido"],
            nombre_completo=data["nombre_completo"],
            dni=data["dni"],
            domicilio=data["domicilio"],
            fecha_nacimiento=datetime.strptime(
                data["fecha_nacimiento"], "%Y-%m-%d"
            ).date(),
            puntos_actuales=100,  # Puntos iniciales
            email_verificado=True,  # Por simplicidad, lo marcamos como verificado
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        # Registrar puntos iniciales en historial
        historial = HistorialPuntos(
            usuario_id=user.id,
            tipo_operacion="carga",
            puntos_cantidad=100,
            descripcion="Puntos de bienvenida al registrarse",
        )
        db.session.add(historial)
        db.session.commit()

        # Generar token
        token = generate_token(user.id)

        return (
            jsonify(
                {
                    "message": "Usuario registrado exitosamente",
                    "token": token,
                    "user": user.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email y contraseña son requeridos"}), 400

        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Credenciales inválidas"}), 401

        if not user.activo:
            return jsonify({"error": "Usuario desactivado"}), 401

        # Actualizar último login
        user.ultimo_login = datetime.utcnow()
        db.session.commit()

        # Generar token
        token = generate_token(user.id)

        return (
            jsonify(
                {"message": "Login exitoso", "token": token, "user": user.to_dict()}
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/verify-token", methods=["POST"])
def verify_user_token():
    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify({"error": "Token requerido"}), 400

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Token inválido o expirado"}), 401

        user = User.query.get(user_id)
        if not user or not user.activo:
            return jsonify({"error": "Usuario no encontrado o desactivado"}), 401

        return jsonify({"valid": True, "user": user.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # En JWT no necesitamos hacer nada en el servidor para logout
    # El frontend simplemente elimina el token
    return jsonify({"message": "Logout exitoso"}), 200
