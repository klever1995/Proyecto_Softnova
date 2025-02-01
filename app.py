from flask import Flask, jsonify, request
from flask_cors import CORS
from cliente_dao import ClienteDAO
from cliente_dto import ClienteDTO
from direccioncombinada_dao import DireccionCombinadaDAO
from direccioncombinada_dto import DireccionCombinadaDTO
from direccion_dao import DireccionDAO
from direccion_dto import DireccionDTO

app = Flask(__name__)
CORS(app)
cliente_dao = ClienteDAO()
direccioncombinada_dao = DireccionCombinadaDAO()
direccion_dao = DireccionDAO()

# Endpoint para obtener todos los clientes
import base64
from flask import jsonify, Flask

@app.route('/clientes', methods=['GET'])
def get_all_clientes():
    cliente_dao = ClienteDAO()
    clientes = cliente_dao.get_all_clientes()
    
    # Convertir cada cliente a un diccionario
    clientes_dict = []
    for cliente in clientes:
        cliente_dict = {
            "id_cliente": cliente.id_cliente,
            "nombre": cliente.nombre,
            "apellido": cliente.apellido,
            "cedula": cliente.cedula,
            "email": cliente.email,
            "telefono": cliente.telefono,
            "fecha_nacimiento": cliente.fecha_nacimiento,
            "genero": cliente.genero
        }
        
        # Manejar el campo foto_cliente
        if cliente.foto_cliente is not None:
            # Convertir bytes a base64 si no es None
            cliente_dict["foto_cliente"] = base64.b64encode(cliente.foto_cliente).decode('utf-8')
        else:
            cliente_dict["foto_cliente"] = None

        clientes_dict.append(cliente_dict)
    
    return jsonify(clientes_dict)


# Endpoint para obtener un cliente por ID
@app.route('/clientes/<int:id_cliente>', methods=['GET'])
def get_cliente_by_id(id_cliente):
    cliente = cliente_dao.get_cliente_by_id(id_cliente)
    
    if cliente:
        # Convertir datos binarios de foto_cliente a Base64 si existe
        if cliente.foto_cliente:
            foto_cliente_base64 = base64.b64encode(cliente.foto_cliente).decode('utf-8')
        else:
            foto_cliente_base64 = None
        
        # Crear un diccionario con los datos del cliente
        cliente_dict = {
            "id_cliente": cliente.id_cliente,
            "foto_cliente": foto_cliente_base64,
            "nombre": cliente.nombre,
            "apellido": cliente.apellido,
            "cedula": cliente.cedula,
            "email": cliente.email,
            "telefono": cliente.telefono,
            "fecha_nacimiento": cliente.fecha_nacimiento,
            "genero": cliente.genero
        }
        
        return jsonify(cliente_dict)
    else:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    

@app.route('/clientes', methods=['POST'])
def create_cliente():
    data = request.json
    
    # Obtener la imagen en formato base64
    foto_cliente_base64 = data.get('foto_cliente')
    
    if foto_cliente_base64:
        try:
            # Convertir la cadena base64 a binario
            foto_cliente_bin = base64.b64decode(foto_cliente_base64)
            print(f"Tamaño de la foto en binario: {len(foto_cliente_bin)} bytes")  # Imprimir tamaño de la imagen en binario
        except Exception as e:
            return jsonify({'error': f'Error al procesar la foto del cliente: {str(e)}'}), 400
    else:
        foto_cliente_bin = None
    
    # Imprimir los datos del cliente para verificar
    print("Datos del cliente recibidos:", data)

    # Crear el objeto ClienteDTO
    cliente = {
        'id_cliente': None,
        'foto_cliente': foto_cliente_bin,
        'nombre': data['nombre'],
        'apellido': data['apellido'],
        'cedula': data['cedula'],
        'email': data['email'],
        'telefono': data['telefono'],
        'fecha_nacimiento': data['fecha_nacimiento'],
        'genero': data['genero']
    }

    # Verificar que el cliente tiene la imagen y otros datos correctamente
    print("Cliente a insertar:", cliente)

    # Guardar el cliente en la base de datos
    try:
        cliente_dao.create_cliente(cliente)
        return jsonify({'message': 'Cliente creado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': f'Error al crear el cliente: {str(e)}'}), 500

# Endpoint para actualizar un cliente
@app.route('/clientes/<int:id_cliente>', methods=['PUT'])
def update_cliente(id_cliente):
    data = request.json
    cliente = cliente_dao.get_cliente_by_id(id_cliente)
    
    if cliente:
        # Verificar si se ha enviado una nueva foto en Base64
        if 'foto_cliente' in data and data['foto_cliente']:
            try:
                foto_cliente_bin = base64.b64decode(data['foto_cliente'])
                cliente.foto_cliente = foto_cliente_bin  # Actualizar la foto del cliente
            except Exception as e:
                return jsonify({'error': 'Error al decodificar la foto del cliente: {}'.format(str(e))}), 400
        
        # Actualizar otros campos
        cliente.nombre = data.get('nombre', cliente.nombre)
        cliente.apellido = data.get('apellido', cliente.apellido)
        cliente.cedula = data.get('cedula', cliente.cedula)
        cliente.email = data.get('email', cliente.email)
        cliente.telefono = data.get('telefono', cliente.telefono)
        cliente.fecha_nacimiento = data.get('fecha_nacimiento', cliente.fecha_nacimiento)
        cliente.genero = data.get('genero', cliente.genero)
        
        # Guardar cambios en la base de datos
        cliente_dao.update_cliente(cliente)
        
        return jsonify({'message': 'Cliente actualizado con éxito'})
    else:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
# Endpoint para eliminar un cliente
@app.route('/clientes/<int:id_cliente>', methods=['DELETE'])
def delete_cliente(id_cliente):
    cliente = cliente_dao.get_cliente_by_id(id_cliente)
    if cliente:
        try:
            # Eliminar el cliente, incluyendo las direcciones asociadas
            cliente_dao.delete_cliente(id_cliente)
            return jsonify({'message': 'Cliente y sus direcciones eliminados con éxito'}), 200
        except Exception as e:
            return jsonify({'error': f'Error al eliminar el cliente: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    

# Endpoint para obtener todas las direcciones
@app.route('/direcciones', methods=['GET'])
def get_all_direcciones():
    direcciones = direccioncombinada_dao.get_all_direcciones()
    
    # Si no hay direcciones, se puede devolver una lista vacía o un mensaje adecuado
    if not direcciones:
        return jsonify({"message": "No hay direcciones disponibles"}), 404
    
    direcciones_dict = []
    
    for direccion in direcciones:
        direccion_dict = {
            "id_direccion": direccion.id_direccion,
            "id_cliente": direccion.id_cliente,
            "tipo": direccion.tipo,
            "calle_principal": direccion.calle_principal,
            "calle_secundaria": direccion.calle_secundaria,
            "numero_casa": direccion.numero_casa,
            "ciudad": direccion.ciudad,
            "provincia": direccion.provincia,
            "codigo_postal": direccion.codigo_postal,
            "pais": direccion.pais,
            "punto_referencia": direccion.punto_referencia
        }
        direcciones_dict.append(direccion_dict)
    
    return jsonify(direcciones_dict)


# Endpoint para obtener una dirección por ID
@app.route('/direcciones/<int:id_direccion>', methods=['GET'])
def get_direccion_by_id(id_direccion):
    direccion = direccioncombinada_dao.get_direccion_by_id(id_direccion)
    
    if direccion:
        direccion_dict = {
            "id_direccion": direccion.id_direccion,
            "id_cliente": direccion.id_cliente,
            "tipo": direccion.tipo,
            "calle_principal": direccion.calle_principal,
            "calle_secundaria": direccion.calle_secundaria,
            "numero_casa": direccion.numero_casa,
            "ciudad": direccion.ciudad,
            "provincia": direccion.provincia,
            "codigo_postal": direccion.codigo_postal,
            "pais": direccion.pais,
            "punto_referencia": direccion.punto_referencia
        }
        return jsonify(direccion_dict)
    else:
        return jsonify({'error': 'Dirección no encontrada'}), 404
    
# Endpoint para crear una nueva dirección
@app.route('/direcciones', methods=['POST'])
def create_direccion():
    try:
        data = request.get_json()  # Obtener los datos del cuerpo de la solicitud

        # Crear el objeto DTO de dirección con los datos recibidos
        direccion_dto = DireccionDTO(
            id_cliente=data['id_cliente'],
            id_tipo_direccion=data['id_tipo_direccion'],
            calle_principal=data['calle_principal'],
            calle_secundaria=data['calle_secundaria'],
            numero_casa=data.get('numero_casa'),
            ciudad=data['ciudad'],
            provincia=data['provincia'],
            codigo_postal=data['codigo_postal'],
            pais=data['pais'],
            punto_referencia=data.get('punto_referencia')
        )

        direccion_dao.create_direccion(direccion_dto)  # Llamar al DAO para crear la dirección

        return jsonify({"message": "Dirección creada con éxito"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
#Endpoint para obtener direcciones por ID
@app.route('/direcciones/cliente/<int:id_cliente>', methods=['GET'])
def get_direcciones_by_cliente(id_cliente):
    # Llamar a la función que obtiene las direcciones combinadas del DAO
    direcciones = direccioncombinada_dao.get_direcciones_by_id_cliente(id_cliente)
    
    if direcciones:
        # Crear una lista de diccionarios con las direcciones
        direccion_list = []
        for direccion in direcciones:
            direccion_dict = {
                "id_direccion": direccion.id_direccion,
                "id_cliente": direccion.id_cliente,
                "id_tipo_direccion": direccion.id_tipo_direccion,
                "tipo": direccion.tipo,  # Aquí es donde se muestra el tipo de dirección
                "calle_principal": direccion.calle_principal,
                "calle_secundaria": direccion.calle_secundaria,
                "numero_casa": direccion.numero_casa,
                "ciudad": direccion.ciudad,
                "provincia": direccion.provincia,
                "codigo_postal": direccion.codigo_postal,
                "pais": direccion.pais,
                "punto_referencia": direccion.punto_referencia
            }
            direccion_list.append(direccion_dict)
        
        return jsonify(direccion_list), 200  # Respuesta con código 200 OK
    else:
        return jsonify({'message': 'No se encontraron direcciones para este cliente'}), 404  # No se encontraron direcciones

# Endpoint para eliminar una dirección
@app.route('/direcciones/<int:id_direccion>', methods=['DELETE'])
def delete_direccion(id_direccion):
    try:
        direccion_dao.delete_direccion(id_direccion)  # Llamar al DAO para eliminar la dirección
        return jsonify({"message": "Dirección eliminada con éxito"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Cerrar conexión al finalizar
@app.teardown_appcontext
def close_connection(exception):
    cliente_dao.close()

if __name__ == '__main__':
    app.run(debug=True)
