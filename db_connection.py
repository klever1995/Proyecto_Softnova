import mysql.connector
from mysql.connector import Error

def create_connection():
    """Crea y devuelve una conexión a la base de datos MySQL"""
    try:
        connection = mysql.connector.connect(
            host='localhost',  # Dirección del servidor de MySQL
            database='GestionClientes',  # Nombre de la base de datos
            user='root',  # Usuario de MySQL
            password='123456'  # Tu contraseña de MySQL
        )
        if connection.is_connected():
            print("Conexión exitosa a la base de datos")
            return connection
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None

def close_connection(connection):
    """Cierra la conexión a la base de datos"""
    if connection.is_connected():
        connection.close()
        print("Conexión cerrada")
