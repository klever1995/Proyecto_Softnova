import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  InputLabel,
  Select, 
  Paper,
  Button,
  FormControl,
  TextField,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Input,
} from '@mui/material';
import axios from 'axios';

const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telefonoError, setTelefonoError] = useState('');
  const [fechaNacimientoError, setFechaNacimientoError] = useState('');
  const [cedulasExistentes, setCedulasExistentes] = useState([]);
  const [generoError, setGeneroError] = useState('');
  const [open, setOpen] = useState(false); // Estado para abrir/cerrar el formulario de nuevo cliente
  const [newClient, setNewClient] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    foto_cliente: '', // Para la foto en base64
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    if (name === 'nombre') {
      if (!validateNombre(value)) {
        setNombreError("El nombre solo puede contener letras y espacios.");
      } else {
        setNombreError('');
      }
    }
  // Validación específica para el campo 'apellido'
  if (name === 'apellido') {
    if (!validateApellido(value)) {
      setApellidoError("El apellido solo puede contener letras y espacios.");
    } else {
      setApellidoError('');
    }
  }
  if (name === 'cedula') {
    if (!value.trim()) {
      setCedulaError("La cédula no puede estar vacía.");
    } else if (value.trim().length !== 10) {
      setCedulaError("La cédula debe tener 10 dígitos.");
    } else if (!validateCedula(value)) {
      setCedulaError("La cédula no es válida.");
    } else if (cedulasExistentes.includes(value)) {
      setCedulaError("La cédula ya está registrada.");
    } else {
      setCedulaError('');
    }
  }
  if (name === 'email') {
    const regex = /^[a-zA-Z0-9._%+-]+@(hotmail\.com|outlook\.com)$/;
    if (!regex.test(value)) {
      setEmailError('El correo debe ser una cuenta de Hotmail o Outlook.');
    } else {
      setEmailError('');
    }
  }
  if (name === 'telefono') {
    if (!value.trim()) {
      setTelefonoError("El número de teléfono no puede estar vacío.");
    } else if (!validateTelefono(value)) {
      setTelefonoError("El teléfono debe tener 10 dígitos y comenzar con 09.");
    } else {
      setTelefonoError('');
    }
  }
  if (name === 'fecha_nacimiento') {
    if (!value.trim()) {
      setFechaNacimientoError("La fecha de nacimiento no puede estar vacía.");
    } else if (!validateFechaNacimiento(value)) {
      setFechaNacimientoError("Debes tener al menos 18 años.");
    } else {
      setFechaNacimientoError('');
    }
  }
  if (name === 'genero') {
    if (!value) {
      setGeneroError('Debe seleccionar un género.');
    } else {
      setGeneroError('');
    }
  }
};
  
  
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Función de validación para el nombre
const validateNombre = (nombre) => {
  const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  return regex.test(nombre);
};

  //Función de validacion para el apellido
const validateApellido = (apellido) => {
  const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  return regex.test(apellido);
};

//Funcion para validar la cedula
const validateCedula = (cedula) => {
  // Verifica que la cédula tenga exactamente 10 dígitos
  if (cedula.length !== 10) return false;

  // Verifica que solo contenga números
  const regex = /^[0-9]+$/;
  if (!regex.test(cedula)) return false;

  // Validación del algoritmo de cédula (en Ecuador)
  const cedulaArray = cedula.split('').map((num) => parseInt(num, 10));
  
  // Los dos primeros dígitos forman el código de la provincia (01-24)
  const provinceCode = cedulaArray[0] * 10 + cedulaArray[1];

  // Reglas de validación del primer dígito
  if (provinceCode < 1 || provinceCode > 24) return false; // La provincia debe estar entre 01 y 24

  let sum = 0;
  let multiplier = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  // Sumatoria de los primeros 9 dígitos de la cédula
  for (let i = 0; i < 9; i++) {
    let product = cedulaArray[i] * multiplier[i];
    if (product >= 10) {
      // Si el producto es mayor o igual a 10, se suman los dígitos del número resultante
      sum += product - 9; // Equivalente a sumarle las unidades del número resultante
    } else {
      sum += product;
    }
  }

  // Verifica si la cédula es válida usando el algoritmo
  const checksum = (10 - (sum % 10)) % 10;
  if (checksum !== cedulaArray[9]) return false;

  return true;
};


// Función de validación para el teléfono
const validateTelefono = (telefono) => {
  const regex = /^(09)[0-9]{8}$/; // El número debe comenzar con 09 y tener 10 dígitos
  return regex.test(telefono);
};

const validateFechaNacimiento = (fecha) => {
  if (!fecha) return false; // Si la fecha está vacía

  const fechaNacimiento = new Date(fecha);
  const hoy = new Date();

  // Calculamos la diferencia de años
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
  const diaDiferencia = hoy.getDate() - fechaNacimiento.getDate();

  // Ajustamos la edad si el cumpleaños aún no ha pasado en el año actual
  if (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)) {
    return edad - 1 >= 18;
  }

  return edad >= 18;
};

  // Función para calcular la edad
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();

    if (mes < nacimiento.getMonth() || (mes === nacimiento.getMonth() && dia < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleVerDirecciones = (idCliente) => {
    navigate(`/clientes/${idCliente}/direcciones`); // Agrega "/clientes/" antes del id
  };
  

  // Abrir el modal para crear un nuevo cliente
  const handleOpen = () => {
    setOpen(true);
  };

  // Cerrar el modal para crear un nuevo cliente
  const handleClose = () => {
    setOpen(false);
  };

  // Función para manejar la carga de la foto
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewClient((prev) => ({
          ...prev,
          foto_cliente: reader.result.split(',')[1], // Guardamos solo la parte base64
        }));
      };
      reader.readAsDataURL(file); // Leer la imagen y convertirla a base64
    }
  };

  // Función para eliminar un cliente
const handleDelete = async (id_cliente) => {
  try {
    // Realizar solicitud DELETE al servidor
    const response = await axios.delete(`http://127.0.0.1:5000/clientes/${id_cliente}`);
    
    // Si la eliminación es exitosa, mostrar mensaje y actualizar la lista
    console.log(response.data.message);
    
    // Actualizar la lista de clientes removiendo el cliente eliminado
    setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id_cliente !== id_cliente));
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
  }
};

  // Manejar el envío del formulario para crear un nuevo cliente
  const handleSubmit = async () => {
    if (!newClient.nombre.trim()) {
      alert("El nombre no puede estar vacío.");
      return;
    }
    if (!validateNombre(newClient.nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }
    // Validar el apellido antes de enviar el formulario
    if (!newClient.apellido.trim()) {
      setApellidoError("El apellido no puede estar vacío.");
      return;
    }
    const cedulaExistente = clientes.some(cliente => cliente.cedula === newClient.cedula);
    if (cedulaExistente) {
    alert("La cédula ingresada ya existe. Por favor, ingresa una cédula diferente.");
    return;
    }
    if (!validateApellido(newClient.apellido)) {
      setApellidoError("El apellido solo puede contener letras y espacios.");
      return;
    }
    if (!newClient.cedula.trim()) {
      setCedulaError("La cédula no puede estar vacía.");
      return;
    }
    if (!validateCedula(newClient.cedula)) {
      setCedulaError("La cédula no es válida.");
      return;
    }
    // Validación de correo electrónico
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(hotmail\.com|outlook\.com)$/;
  if (!newClient.email.trim()) {
    setEmailError("El correo electrónico no puede estar vacío.");
    return;
  }

  if (!emailRegex.test(newClient.email)) {
    setEmailError("El correo debe ser una cuenta de Hotmail o Outlook.");
    return; // Detiene la ejecución si el correo no es válido
  }
  // Validación de teléfono
if (!newClient.telefono.trim()) {
  setTelefonoError("El número de teléfono no puede estar vacío.");
  return;
}
if (!validateTelefono(newClient.telefono)) {
  setTelefonoError("El teléfono debe tener 10 dígitos y comenzar con 09.");
  return;
}
// Validación de fecha de nacimiento
if (!newClient.fecha_nacimiento.trim()) {
  setFechaNacimientoError("La fecha de nacimiento no puede estar vacía.");
  return;
}
if (!validateFechaNacimiento(newClient.fecha_nacimiento)) {
  setFechaNacimientoError("Debes tener al menos 18 años.");
  return;
}
 // Validación del campo Género
 if (!newClient.genero) {
  setGeneroError('Debe seleccionar un género.');
  return;
}
    try {
      const response = await axios.post('http://127.0.0.1:5000/clientes', newClient);
      console.log(response.data.message);
      // Actualizar la lista de clientes
      setClientes((prevClientes) => [...prevClientes, newClient]);
      handleClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al crear el cliente:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Clientes</h1>

      {/* Campo de búsqueda */}
      <TextField
        label="Buscar cliente"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearch}
      />

      {/* Botones de acción */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Nuevo
        </Button>
      </div>

      {/* Tabla de clientes */}
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Avatar</TableCell>
        <TableCell>Nombre</TableCell>
        <TableCell>Cedula</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Teléfono</TableCell>
        <TableCell>Edad</TableCell>
        <TableCell>Género</TableCell>
        <TableCell>Direcciones</TableCell> {/* Renombrada de "Acciones" a "Direcciones" */}
        <TableCell>Acciones</TableCell> {/* Nueva columna para botones */}
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedClientes.map((cliente) => (
        <TableRow key={cliente.id_cliente}>
          <TableCell>
            {cliente.foto_cliente ? (
              <img
                src={`data:image/png;base64,${cliente.foto_cliente}`}
                alt={cliente.nombre}
                style={{ width: '40px', borderRadius: '50%' }}
              />
            ) : (
              'N/A'
            )}
          </TableCell>
          <TableCell>{`${cliente.nombre} ${cliente.apellido}`}</TableCell>
          <TableCell>{cliente.cedula}</TableCell>
          <TableCell>{cliente.email}</TableCell>
          <TableCell>{cliente.telefono}</TableCell>
          <TableCell>{calcularEdad(cliente.fecha_nacimiento)}</TableCell>
          <TableCell>{cliente.genero}</TableCell>
          <TableCell>
            <Button variant="contained"
                  color="info"
                  onClick={() => handleVerDirecciones(cliente.id_cliente)} >
              Ver
            </Button>
          </TableCell>
          <TableCell>
            <Button variant="contained"
          color="error"
          style={{ marginLeft: '10px' }}
          onClick={() => handleDelete(cliente.id_cliente)}>
              Eliminar
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <Pagination
          count={Math.ceil(filteredClientes.length / rowsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </div>

      {/* Modal para crear un nuevo cliente */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Nuevo Cliente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            name="nombre"
            value={newClient.nombre}
            onChange={handleInputChange}
            error={!!nombreError}
            helperText={nombreError}
          />
          <TextField
            label="Apellido"
            variant="outlined"
            fullWidth
            margin="normal"
            name="apellido"
            value={newClient.apellido}
            onChange={handleInputChange}
            error={!!apellidoError}
            helperText={apellidoError}
          />
          <TextField
            label="Cédula"
            variant="outlined"
            fullWidth
            margin="normal"
            name="cedula"
            value={newClient.cedula}
            onChange={handleInputChange}
            error={!!cedulaError}
            helperText={cedulaError}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            margin="normal"
            name="telefono"
            value={newClient.telefono}
            onChange={handleInputChange}
            error={!!telefonoError}
            helperText={telefonoError}
          />
          <TextField
            label="Fecha de Nacimiento"
            variant="outlined"
            fullWidth
            margin="normal"
            name="fecha_nacimiento"
            value={newClient.fecha_nacimiento}
            onChange={handleInputChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!fechaNacimientoError}
            helperText={fechaNacimientoError}
          />
         <FormControl fullWidth margin="normal" error={!!generoError}>
              <InputLabel>Género</InputLabel>
              <Select
                label="Género"
                name="genero"
                value={newClient.genero}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="">Seleccione un género</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
              </Select>
              {generoError && <FormHelperText>{generoError}</FormHelperText>}
            </FormControl>
          {/* Campo para subir foto */}
          <Input
            type="file"
            inputProps={{ accept: 'image/*' }}
            onChange={handleFileChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Clientes;




