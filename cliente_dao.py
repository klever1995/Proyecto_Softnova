from db_connection import create_connection, close_connection
from cliente_dto import ClienteDTO

class ClienteDAO:
    def __init__(self):
        self.connection = create_connection()  # Abre la conexión al crear la instancia

    def ensure_connection(self):
        """Verifica si la conexión está activa y la restaura si es necesario."""
        if not self.connection or not self.connection.is_connected():
            self.connection = create_connection()

    def create_cliente(self, cliente_dto):
        cursor = None
        try:
            self.ensure_connection()  # Aseguramos que la conexión esté activa
            cursor = self.connection.cursor()

            # Verificar si la imagen binaria está siendo pasada correctamente
            if cliente_dto.get('foto_cliente'):  # Usamos .get() para acceder al valor de la clave 'foto_cliente'
                print(f"Tamaño de la foto del cliente: {len(cliente_dto['foto_cliente'])} bytes")
            else:
                print("No se recibió ninguna foto del cliente.")

            query = """
                INSERT INTO Clientes (FotoCliente, Nombre, Apellido, Cedula, Email, Telefono, FechaNacimiento, Genero)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            data = (
                cliente_dto.get('foto_cliente'), cliente_dto.get('nombre'), cliente_dto.get('apellido'),
                cliente_dto.get('cedula'), cliente_dto.get('email'), cliente_dto.get('telefono'),
                cliente_dto.get('fecha_nacimiento'), cliente_dto.get('genero')
            )

            cursor.execute(query, data)
            self.connection.commit()  # Confirmamos los cambios

            print("Cliente creado con éxito")

        except Exception as e:
            print(f"Error al crear el cliente: {e}")

        finally:
            # Aseguramos que el cursor se cierre, incluso si ocurrió un error
            if cursor:
                cursor.close()


    def get_all_clientes(self):
        cursor = self.connection.cursor()
        query = "SELECT * FROM Clientes"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        return [ClienteDTO(*row) for row in results]

    def update_cliente(self, cliente_dto):
        cursor = None
        try:
            cursor = self.connection.cursor()
            query = """
            UPDATE Clientes
            SET FotoCliente = %s, Nombre = %s, Apellido = %s, Cedula = %s, Email = %s,
                Telefono = %s, FechaNacimiento = %s, Genero = %s
            WHERE IdCliente = %s
            """
            data = (
                cliente_dto.foto_cliente, cliente_dto.nombre, cliente_dto.apellido, cliente_dto.cedula,
                cliente_dto.email, cliente_dto.telefono, cliente_dto.fecha_nacimiento, cliente_dto.genero,
                cliente_dto.id_cliente
            )
            cursor.execute(query, data)
            self.connection.commit()
        except Exception as e:
            print(f"Error al actualizar el cliente: {e}")
        finally:
            # Aseguramos que el cursor se cierre, incluso si ocurrió un error
            if cursor:
                cursor.close()

#Eliminar cliente con direcciones asociadas

    def delete_cliente(self, cliente_id):
        cursor = None
        try:
            cursor = self.connection.cursor()

            # Eliminar direcciones asociadas al cliente
            delete_direcciones_query = "DELETE FROM Direcciones WHERE IdCliente = %s"
            cursor.execute(delete_direcciones_query, (cliente_id,))

            # Ahora eliminar al cliente
            delete_cliente_query = "DELETE FROM Clientes WHERE IdCliente = %s"
            cursor.execute(delete_cliente_query, (cliente_id,))

            self.connection.commit()
        except Exception as e:
            print(f"Error al eliminar el cliente: {e}")
            self.connection.rollback()
        finally:
            if cursor:
                cursor.close()



    def get_cliente_by_id(self, id_cliente):
        self.ensure_connection()  # Verificar si la conexión está activa
        cursor = self.connection.cursor()
        query = "SELECT * FROM Clientes WHERE IdCliente = %s"
        cursor.execute(query, (id_cliente,))
        cliente_data = cursor.fetchone()

        if cliente_data:
            cliente = ClienteDTO(
                id_cliente=cliente_data[0],
                foto_cliente=cliente_data[1],
                nombre=cliente_data[2],
                apellido=cliente_data[3],
                cedula=cliente_data[4],
                email=cliente_data[5],
                telefono=cliente_data[6],
                fecha_nacimiento=cliente_data[7],
                genero=cliente_data[8]
            )
            return cliente
        else:
            return None

    def close(self):
        # Asegurarse de que la conexión se cierre correctamente
        if self.connection and self.connection.is_connected():
            close_connection(self.connection)
