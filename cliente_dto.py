class ClienteDTO:
    def __init__(self, id_cliente, foto_cliente, nombre, apellido, cedula, email, telefono, fecha_nacimiento, genero):
        self.id_cliente = id_cliente
        self.foto_cliente = foto_cliente
        self.nombre = nombre
        self.apellido = apellido
        self.cedula = cedula
        self.email = email
        self.telefono = telefono
        self.fecha_nacimiento = fecha_nacimiento
        self.genero = genero

    def __repr__(self):
        return f"ClienteDTO({self.id_cliente}, {self.nombre}, {self.apellido}, {self.email})"
