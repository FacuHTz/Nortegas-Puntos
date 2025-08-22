from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(80), nullable=False)
    apellido = db.Column(db.String(80), nullable=False)
    nombre_completo = db.Column(db.String(120), nullable=False)
    dni = db.Column(db.String(20), unique=True, nullable=False)
    domicilio = db.Column(db.String(200), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    puntos_actuales = db.Column(db.Integer, default=100)
    email_verificado = db.Column(db.Boolean, default=False)
    activo = db.Column(db.Boolean, default=True)
    ultimo_login = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "nombre_completo": self.nombre_completo,
            "dni": self.dni,
            "domicilio": self.domicilio,
            "fecha_nacimiento": (
                self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None
            ),
            "puntos_actuales": self.puntos_actuales,
            "email_verificado": self.email_verificado,
            "activo": self.activo,
            "ultimo_login": (
                self.ultimo_login.isoformat() if self.ultimo_login else None
            ),
        }


class CodigoPromocional(db.Model):
    __tablename__ = "codigos_promocionales"

    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(50), unique=True, nullable=False)
    puntos_valor = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_expiracion = db.Column(db.DateTime)
    usos_maximos = db.Column(db.Integer)
    usos_actuales = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "puntos_valor": self.puntos_valor,
            "descripcion": self.descripcion,
            "activo": self.activo,
            "fecha_creacion": (
                self.fecha_creacion.isoformat() if self.fecha_creacion else None
            ),
            "fecha_expiracion": (
                self.fecha_expiracion.isoformat() if self.fecha_expiracion else None
            ),
            "usos_maximos": self.usos_maximos,
            "usos_actuales": self.usos_actuales,
        }


class Administrador(db.Model):
    __tablename__ = "administradores"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    rol = db.Column(db.String(20), default="admin")  # Ajustado a VARCHAR(20)
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    # ultimo_login eliminado para coincidir con la BD existente

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "rol": self.rol,
            "activo": self.activo,
            "fecha_creacion": (
                self.fecha_creacion.isoformat() if self.fecha_creacion else None
            ),
        }


class HistorialPuntos(db.Model):
    __tablename__ = "historial_puntos"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    tipo_operacion = db.Column(
        db.String(50), nullable=False
    )  # 'carga', 'canje', 'ajuste'
    puntos_cantidad = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)
    codigo_promocional = db.Column(db.String(50))
    referencia_externa = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "tipo_operacion": self.tipo_operacion,
            "puntos": self.puntos,
            "descripcion": self.descripcion,
            "fecha": self.fecha.isoformat() if self.fecha else None,
            "codigo_promocional": self.codigo_promocional,
            "referencia_externa": self.referencia_externa,
        }


class CanjeRealizado(db.Model):
    __tablename__ = "canjes_realizados"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, nullable=False)
    tipo_canje = db.Column(db.String(100), nullable=False)
    puntos_utilizados = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text)
    estado = db.Column(
        db.String(50), default="pendiente"
    )  # 'pendiente', 'procesado', 'entregado'
    fecha_canje = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_entrega = db.Column(db.DateTime)
    datos_entrega = db.Column(db.Text)  # JSON con datos de entrega
    notas = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "tipo_canje": self.tipo_canje,
            "puntos_utilizados": self.puntos_utilizados,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "fecha_canje": self.fecha_canje.isoformat() if self.fecha_canje else None,
            "fecha_entrega": (
                self.fecha_entrega.isoformat() if self.fecha_entrega else None
            ),
            "datos_entrega": self.datos_entrega,
            "notas": self.notas,
        }
