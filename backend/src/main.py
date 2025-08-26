import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.points import points_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "static"))

# Configuración desde variables de entorno
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "fallback-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", "sqlite:///database/app.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configurar CORS
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
CORS(app, origins=cors_origins)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(points_bp, url_prefix="/api")

# Inicializar base de datos
db.init_app(app)


# Health check endpoint
@app.route("/health")
def health_check():
    return {"status": "healthy", "service": "NorteGAS Backend"}, 200


with app.app_context():
    db.create_all()

    # Crear códigos promocionales iniciales si no existen
    from src.models.user import CodigoPromocional, Administrador

    # Códigos promocionales
    codigos_iniciales = [
        {
            "codigo": "NORTEGAS2024",
            "puntos_valor": 200,
            "descripcion": "Código promocional NorteGAS 2024",
        },
        {
            "codigo": "GASNATURAL",
            "puntos_valor": 300,
            "descripcion": "Código Gas Natural",
        },
        {
            "codigo": "PROMO2024",
            "puntos_valor": 250,
            "descripcion": "Promoción especial 2024",
        },
        {
            "codigo": "BIENVENIDA",
            "puntos_valor": 100,
            "descripcion": "Código de bienvenida",
        },
        {"codigo": "ESPECIAL", "puntos_valor": 150, "descripcion": "Código especial"},
        {"codigo": "BONUS", "puntos_valor": 75, "descripcion": "Código bonus"},
    ]

    for codigo_data in codigos_iniciales:
        codigo_existente = CodigoPromocional.query.filter_by(
            codigo=codigo_data["codigo"]
        ).first()
        if not codigo_existente:
            nuevo_codigo = CodigoPromocional(**codigo_data)
            db.session.add(nuevo_codigo)

    # Crear administrador inicial si no existe
    admin_existente = Administrador.query.filter_by(email="admin@nortegas.com").first()
    if not admin_existente:
        admin = Administrador(
            email="admin@nortegas.com", nombre="Administrador NorteGAS", rol="admin"
        )
        admin.set_password("admin123")
        db.session.add(admin)

    db.session.commit()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true",
    )
