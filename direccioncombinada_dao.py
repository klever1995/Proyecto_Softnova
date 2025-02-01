from db_connection import create_connection, close_connection
from direccioncombinada_dto import DireccionCombinadaDTO

class DireccionCombinadaDAO:
    def get_all_direcciones(self):
        connection = create_connection()  # Crear nueva conexión para cada consulta
        cursor = connection.cursor()
        try:
            query = """
                SELECT d.IdDireccion, d.IdCliente, d.IdTipoDireccion, td.Tipo, d.CallePrincipal, 
                       d.CalleSecundaria, d.NumeroCasa, d.Ciudad, d.Provincia, d.CodigoPostal, 
                       d.Pais, d.PuntoReferencia
                FROM Direcciones d
                INNER JOIN TipoDirecciones td ON d.IdTipoDireccion = td.IdTipoDireccion
            """
            cursor.execute(query)
            results = cursor.fetchall()
            return [DireccionCombinadaDTO(*row) for row in results]
        finally:
            cursor.close()
            close_connection(connection)  # Cerrar conexión después de la consulta

    def get_direcciones_by_id_cliente(self, id_cliente):
        connection = create_connection()  # Crear nueva conexión para cada consulta
        cursor = connection.cursor()
        try:
            query = """
                SELECT d.IdDireccion, d.IdCliente, d.IdTipoDireccion, td.Tipo, d.CallePrincipal, 
                       d.CalleSecundaria, d.NumeroCasa, d.Ciudad, d.Provincia, d.CodigoPostal, 
                       d.Pais, d.PuntoReferencia
                FROM Direcciones d
                INNER JOIN TipoDirecciones td ON d.IdTipoDireccion = td.IdTipoDireccion
                WHERE d.IdCliente = %s
            """
            cursor.execute(query, (id_cliente,))
            results = cursor.fetchall()
            return [DireccionCombinadaDTO(*row) for row in results]
        finally:
            cursor.close()
            close_connection(connection)  # Cerrar conexión después de la consulta
