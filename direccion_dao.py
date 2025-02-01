from db_connection import create_connection, close_connection
from direccion_dto import DireccionDTO

class DireccionDAO:
    def __init__(self):
        self.connection = create_connection()  # Abre la conexión al crear la instancia

    def ensure_connection(self):
        """Verifica si la conexión está activa y la restaura si es necesario."""
        if not self.connection or not self.connection.is_connected():
            self.connection = create_connection()

    def create_direccion(self, direccion_dto):
        cursor = None
        try:
            self.ensure_connection()  # Aseguramos que la conexión esté activa
            cursor = self.connection.cursor()

            query = """
                INSERT INTO Direcciones (IdCliente, IdTipoDireccion, CallePrincipal, CalleSecundaria,
                                         NumeroCasa, Ciudad, Provincia, CodigoPostal, Pais, PuntoReferencia)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = (
                direccion_dto.id_cliente, direccion_dto.id_tipo_direccion, direccion_dto.calle_principal,
                direccion_dto.calle_secundaria, direccion_dto.numero_casa, direccion_dto.ciudad,
                direccion_dto.provincia, direccion_dto.codigo_postal, direccion_dto.pais,
                direccion_dto.punto_referencia
            )

            cursor.execute(query, data)
            self.connection.commit()  # Confirmamos los cambios

            print("Dirección creada con éxito")

        except Exception as e:
            print(f"Error al crear la dirección: {e}")

        finally:
            if cursor:
                cursor.close()

    def delete_direccion(self, id_direccion):
        cursor = None
        try:
            self.ensure_connection()  # Aseguramos que la conexión esté activa
            cursor = self.connection.cursor()

            query = "DELETE FROM Direcciones WHERE IdDireccion = %s"
            cursor.execute(query, (id_direccion,))
            self.connection.commit()

            print("Dirección eliminada con éxito")

        except Exception as e:
            print(f"Error al eliminar la dirección: {e}")
            self.connection.rollback()

        finally:
            if cursor:
                cursor.close()

    def close(self):
        # Asegurarse de que la conexión se cierre correctamente
        if self.connection and self.connection.is_connected():
            close_connection(self.connection)
