class DireccionCombinadaDTO:
    def __init__(self, id_direccion, id_cliente, id_tipo_direccion, tipo, calle_principal, calle_secundaria, 
                 numero_casa, ciudad, provincia, codigo_postal, pais, punto_referencia):
        self.id_direccion = id_direccion
        self.id_cliente = id_cliente
        self.id_tipo_direccion = id_tipo_direccion
        self.tipo = tipo  # Representa el tipo de dirección (columna de TipoDirecciones)
        self.calle_principal = calle_principal
        self.calle_secundaria = calle_secundaria
        self.numero_casa = numero_casa
        self.ciudad = ciudad
        self.provincia = provincia
        self.codigo_postal = codigo_postal
        self.pais = pais
        self.punto_referencia = punto_referencia

    def __repr__(self):
        return (f"DireccionCombinadaDTO(Id: {self.id_direccion}, Cliente: {self.id_cliente}, TipoDireccion: {self.tipo}, "
                f"CallePrincipal: {self.calle_principal}, Ciudad: {self.ciudad}, Pais: {self.pais})")
