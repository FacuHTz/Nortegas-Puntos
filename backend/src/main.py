import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.points import points_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configurar CORS para permitir requests desde el frontend
CORS(app, origins="*")

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(points_bp, url_prefix='/api')

# Configurar base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Crear códigos promocionales iniciales si no existen
    from src.models.user import CodigoPromocional
    codigos_iniciales = [
        {'codigo': 'NORTEGAS2024', 'puntos_valor': 200, 'descripcion': 'Código promocional NorteGAS 2024'},
        {'codigo': 'GASNATURAL', 'puntos_valor': 300, 'descripcion': 'Código Gas Natural'},
        {'codigo': 'PROMO2024', 'puntos_valor': 250, 'descripcion': 'Promoción especial 2024'},
        {'codigo': 'BIENVENIDO', 'puntos_valor': 100, 'descripcion': 'Código de bienvenida'},
        {'codigo': 'ESPECIAL', 'puntos_valor': 150, 'descripcion': 'Código especial'},
        {'codigo': 'BONUS', 'puntos_valor': 75, 'descripcion': 'Código bonus'},
        {'codigo': 'REGALO', 'puntos_valor': 200, 'descripcion': 'Código regalo'},
        {'codigo': 'DEMO123', 'puntos_valor': 50, 'descripcion': 'Código demo'},
    ]
    
    for codigo_data in codigos_iniciales:
        codigo_existente = CodigoPromocional.query.filter_by(codigo=codigo_data['codigo']).first()
        if not codigo_existente:
            nuevo_codigo = CodigoPromocional(**codigo_data)
            db.session.add(nuevo_codigo)
    
    # Crear administrador inicial si no existe
    from src.models.user import Administrador
    admin_existente = Administrador.query.filter_by(email='admin@nortegas.com').first()
    if not admin_existente:
        admin = Administrador(
            email='admin@nortegas.com',
            nombre='Administrador NorteGAS',
            rol='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
    
    db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'status': 'ok', 'message': 'NorteGAS Backend API funcionando correctamente'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
