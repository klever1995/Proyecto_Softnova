-- Crear la base de datos 'GestionClientes'
CREATE DATABASE IF NOT EXISTS GestionClientes;
USE GestionClientes;

-- Crear la tabla 'TipoDirecciones'
CREATE TABLE TipoDirecciones (
    IdTipoDireccion INT AUTO_INCREMENT NOT NULL,
    Tipo VARCHAR(50) NOT NULL,
    PRIMARY KEY (IdTipoDireccion)
);

-- Crear la tabla 'Clientes'
CREATE TABLE Clientes (
    IdCliente INT AUTO_INCREMENT NOT NULL,
    FotoCliente LONGBLOB NULL, -- Campo foto ajustado para MySQL
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Cedula VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15) NULL,
    FechaNacimiento DATE NULL,
    Genero VARCHAR(10) NULL,
    PRIMARY KEY (IdCliente),
    UNIQUE (Email),
    UNIQUE (Cedula)
);

-- Crear la tabla 'Direcciones'
CREATE TABLE Direcciones (
    IdDireccion INT AUTO_INCREMENT NOT NULL,
    IdCliente INT NOT NULL,
    IdTipoDireccion INT NOT NULL,
    CallePrincipal VARCHAR(100) NOT NULL,
    CalleSecundaria VARCHAR(100) NOT NULL,
    NumeroCasa VARCHAR(10) NULL,
    Ciudad VARCHAR(50) NOT NULL,
    Provincia VARCHAR(50) NOT NULL,
    CodigoPostal VARCHAR(10) NOT NULL,
    Pais VARCHAR(50) NOT NULL,
    PuntoReferencia VARCHAR(255) NULL,
    PRIMARY KEY (IdDireccion),
    CONSTRAINT FK_Direcciones_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes (IdCliente),
    CONSTRAINT FK_Direcciones_TipoDirecciones FOREIGN KEY (IdTipoDireccion) REFERENCES TipoDirecciones (IdTipoDireccion)
);
