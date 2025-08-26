import sqlite3
import json
import os
from datetime import datetime


def export_sqlite_data():
    """Exportar datos de SQLite a JSON para migración"""

    db_path = os.path.join("src", "database", "app.db")
    if not os.path.exists(db_path):
        print("❌ No se encontró la base de datos SQLite")
        return None

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Para acceder por nombre de columna
    cursor = conn.cursor()

    export_data = {"export_date": datetime.now().isoformat(), "tables": {}}

    # Tablas a exportar
    tables = [
        "user",
        "codigos_promocionales",
        "administradores",
        "historial_puntos",
        "canjes_realizados",
    ]

    for table in tables:
        try:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            export_data["tables"][table] = [dict(row) for row in rows]
            print(f"✅ Exportados {len(rows)} registros de {table}")
        except sqlite3.OperationalError as e:
            print(f"⚠️ Tabla {table} no existe: {e}")
            export_data["tables"][table] = []

    conn.close()

    # Guardar en archivo JSON
    with open("data_export.json", "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False, default=str)

    print(f"📁 Datos exportados a data_export.json")
    return export_data


if __name__ == "__main__":
    export_sqlite_data()
