import json
import os
import psycopg2
from datetime import datetime
import sys


def import_data_to_postgresql():
    """Importar datos desde JSON a PostgreSQL"""

    # Leer datos exportados
    if not os.path.exists("data_export.json"):
        print("❌ No se encontró data_export.json")
        return False

    with open("data_export.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    # Conectar a PostgreSQL usando DATABASE_URL
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL no configurada")
        return False

    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()

        # Importar cada tabla
        for table_name, records in data["tables"].items():
            if not records:
                print(f"⚠️ No hay datos para {table_name}")
                continue

            print(f"📊 Importando {len(records)} registros a {table_name}")

            for record in records:
                # Construir query de inserción
                columns = list(record.keys())
                values = list(record.values())

                placeholders = ", ".join(["%s"] * len(values))
                columns_str = ", ".join(columns)

                query = f"""
                INSERT INTO {table_name} ({columns_str}) 
                VALUES ({placeholders})
                ON CONFLICT (id) DO NOTHING
                """

                try:
                    cursor.execute(query, values)
                except Exception as e:
                    print(f"⚠️ Error insertando en {table_name}: {e}")

        conn.commit()
        print("✅ Datos importados exitosamente")
        return True

    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        return False
    finally:
        if "conn" in locals():
            conn.close()


if __name__ == "__main__":
    import_data_to_postgresql()
