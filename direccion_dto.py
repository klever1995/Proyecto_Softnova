class DireccionDTO:
    def __init__(self, id_cliente, id_tipo_direccion, calle_principal, calle_secundaria, 
                 numero_casa, ciudad, provincia, codigo_postal, pais, punto_referencia, id_direccion=None):
        self.id_direccion = id_direccion
        self.id_cliente = id_cliente
        self.id_tipo_direccion = id_tipo_direccion
        self.calle_principal = calle_principal
        self.calle_secundaria = calle_secundaria
        self.numero_casa = numero_casa
        self.ciudad = ciudad
        self.provincia = provincia
        self.codigo_postal = codigo_postal
        self.pais = pais
        self.punto_referencia = punto_referencia
