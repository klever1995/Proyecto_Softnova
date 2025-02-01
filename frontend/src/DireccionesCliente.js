import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Avatar,
} from '@mui/material';

function DireccionesCliente() {
  const { id } = useParams();
  const [direcciones, setDirecciones] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [paisError, setPaisError] = useState('');
  const [provinciaError, setProvinciaError] = useState('');
  const [ciudadError, setCiudadError] = useState('');
  const [callePrincipalError, setCallePrincipalError] = useState('');
  const [calleSecundariaError, setCalleSecundariaError] = useState('');
  const [numeroCasaError, setNumeroCasaError] = useState('');
  const [codigoPostalError, setCodigoPostalError] = useState('');
  const [tipoDireccionError, setTipoDireccionError] = useState('');
  const [newDireccion, setNewDireccion] = useState({
    id_cliente: id,
    id_tipo_direccion: '',
    calle_principal: '',
    calle_secundaria: '',
    numero_casa: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    pais: '',
    punto_referencia: '',
  });

  const fetchDirecciones = async () => {
    try {
      const response = await fetch(`http://localhost:5000/direcciones/cliente/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener las direcciones');
      }
      const data = await response.json();
      if (data.length === 0) {
        setError('El usuario no tiene ninguna dirección');
      } else {
        setDirecciones(data);
      }
    } catch (err) {
      setError(err.message || 'Error al obtener las direcciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchCliente = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clientes/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener la información del cliente');
      }
      const data = await response.json();
      setCliente(data);
    } catch (err) {
      setError(err.message || 'Error al obtener la información del cliente');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     // VALIDACIÓN DEL CAMPO PAÍS
     if (!newDireccion.pais.trim()) {
        setPaisError('El país no puede estar vacío.');
        return;
      }
      const paisValidationError = validatePais(newDireccion.pais);
      if (paisValidationError) {
        setPaisError(paisValidationError);
        return;
      }
      // VALIDACIÓN DEL CAMPO PROVINCIA
  if (!newDireccion.provincia.trim()) {
    setProvinciaError('La provincia no puede estar vacía.');
    return;
  }
  const provinciaValidationError = validateProvincia(newDireccion.provincia);
  if (provinciaValidationError) {
    setProvinciaError(provinciaValidationError);
    return;
  }
  // VALIDACIÓN DEL CAMPO CIUDAD
  if (!newDireccion.ciudad.trim()) {
    setCiudadError('La ciudad no puede estar vacía.');
    return;
  }
  const ciudadValidationError = validateCiudad(newDireccion.ciudad);
  if (ciudadValidationError) {
    setCiudadError(ciudadValidationError);
    return;
  }
  // VALIDACIÓN DEL CAMPO CALLE PRINCIPAL
  if (!newDireccion.calle_principal.trim()) {
    setCallePrincipalError('La calle principal no puede estar vacía.');
    return;
  }
  const callePrincipalValidationError = validateCallePrincipal(newDireccion.calle_principal);
  if (callePrincipalValidationError) {
    setCallePrincipalError(callePrincipalValidationError);
    return;
  }
  // VALIDACIÓN DEL CAMPO CALLE SECUNDARIA
  if (!newDireccion.calle_secundaria.trim()) {
    setCalleSecundariaError('La calle secundaria no puede estar vacía.');
    return;
  }
  const calleSecundariaValidationError = validateCalleSecundaria(newDireccion.calle_secundaria);
  if (calleSecundariaValidationError) {
    setCalleSecundariaError(calleSecundariaValidationError);
    return;
  }
  // VALIDACIÓN DEL CAMPO NUMERO CASA
  if (!newDireccion.numero_casa.trim()) {
    setNumeroCasaError('El número de casa no puede estar vacío.');
    return;
  }
  const numeroCasaValidationError = validateNumeroCasa(newDireccion.numero_casa);
  if (numeroCasaValidationError) {
    setNumeroCasaError(numeroCasaValidationError);
    return;
  }
   // VALIDACIÓN DEL CAMPO CÓDIGO POSTAL
   if (!newDireccion.codigo_postal.trim()) {
    setCodigoPostalError('El código postal no puede estar vacío.');
    return;
  }
  const codigoPostalValidationError = validateCodigoPostal(newDireccion.codigo_postal);
  if (codigoPostalValidationError) {
    setCodigoPostalError(codigoPostalValidationError);
    return;
  }
  // VALIDACIÓN DEL CAMPO TIPO DE DIRECCIÓN
  if (!newDireccion.id_tipo_direccion) {
    setTipoDireccionError('Debe seleccionar un tipo de dirección.');
    return;
  }
    try {
      const response = await fetch('http://localhost:5000/direcciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDireccion),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la dirección');
      }

      fetchDirecciones(); // Recargar direcciones
      setOpen(false); // Cerrar el modal
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDireccion((prevDireccion) => ({
      ...prevDireccion,
      [name]: value,
    }));

    if (name === 'pais') {
      // Validación para el campo de país
      if (!value.trim()) {
        setPaisError('El país es obligatorio.');
      } else {
        const errorMessage = validatePais(value);
        if (errorMessage) {
          setPaisError(errorMessage);
        } else {
          setPaisError('');
        }
      }
    }
    if (name === 'provincia') {
        // Validación para el campo de provincia
        if (!value.trim()) {
          setProvinciaError('La provincia es obligatoria.');
        } else {
          const errorMessage = validateProvincia(value);
          if (errorMessage) {
            setProvinciaError(errorMessage);
          } else {
            setProvinciaError('');
          }
        }
      }
      if (name === 'ciudad') {
        // Validación para el campo de ciudad
        if (!value.trim()) {
          setCiudadError('La ciudad es obligatoria.');
        } else {
          const errorMessage = validateCiudad(value);
          if (errorMessage) {
            setCiudadError(errorMessage);
          } else {
            setCiudadError('');
          }
        }
      }
      if (name === 'calle_principal') {
        // Validación para el campo de calle principal
        if (!value.trim()) {
          setCallePrincipalError('La calle principal es obligatoria.');
        } else {
          const errorMessage = validateCallePrincipal(value);
          if (errorMessage) {
            setCallePrincipalError(errorMessage);
          } else {
            setCallePrincipalError('');
          }
        }
      }
      if (name === 'calle_secundaria') {
        // Validación para el campo de calle secundaria
        if (!value.trim()) {
          setCalleSecundariaError('La calle secundaria es obligatoria.');
        } else {
          const errorMessage = validateCalleSecundaria(value);
          if (errorMessage) {
            setCalleSecundariaError(errorMessage);
          } else {
            setCalleSecundariaError('');
          }
        }
      }
      if (name === 'numero_casa') {
        // Validación para el campo de número de casa
        if (!value.trim()) {
          setNumeroCasaError('El número de casa es obligatorio.');
        } else {
          const errorMessage = validateNumeroCasa(value);
          if (errorMessage) {
            setNumeroCasaError(errorMessage);
          } else {
            setNumeroCasaError('');
          }
        }
      }
      if (name === 'codigo_postal') {
        // Validación para el campo de código postal
        if (!value.trim()) {
          setCodigoPostalError('El código postal es obligatorio.');
        } else {
          const errorMessage = validateCodigoPostal(value);
          if (errorMessage) {
            setCodigoPostalError(errorMessage);
          } else {
            setCodigoPostalError('');
          }
        }
      }
    // Validación para el campo de tipo de dirección
    if (name === 'id_tipo_direccion') {
        if (!value) {
          setTipoDireccionError('Debe seleccionar un tipo de dirección.');
        } else {
          setTipoDireccionError('');
        }
      }
  };

  const handleDelete = async (id_direccion) => {
    try {
      const response = await fetch(`http://localhost:5000/direcciones/${id_direccion}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la dirección');
      }

      // Actualizar el estado localmente sin necesidad de volver a hacer un fetch
      setDirecciones(direcciones.filter(direccion => direccion.id_direccion !== id_direccion));
    } catch (err) {
      setError(err.message);
    }
  };

  // Función de validación para el país
  const validatePais = (pais) => {
    const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios

    if (!regex.test(pais)) {
      return 'El país solo puede contener letras';
    }
    if (pais.trim().length < 3) {
      return 'El nombre del país es demasiado corto';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

  // Función de validación para la provincia
const validateProvincia = (provincia) => {
    const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  
    if (!regex.test(provincia)) {
      return 'La provincia solo puede contener letras';
    }
    if (provincia.trim().length < 3) {
      return 'El nombre de la provincia es demasiado corto';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

// Función de validación para la ciudad
const validateCiudad = (ciudad) => {
    const regex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
  
    if (!regex.test(ciudad)) {
      return 'La ciudad solo puede contener letras';
    }
    if (ciudad.trim().length < 3) {
      return 'El nombre de la ciudad es demasiado corto';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

// Función de validación para la calle principal
const validateCallePrincipal = (calle) => {
    const regex = /^[a-zA-Z0-9\s\-.,]+$/; // Permitir letras, números, espacios, guiones, puntos y comas
  
    if (!regex.test(calle)) {
      return 'La calle solo puede contener letras, números, espacios, guiones, puntos y comas';
    }
    if (calle.trim().length < 5) {
      return 'La calle principal es demasiado corta';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

  // Función de validación para la calle secundaria
const validateCalleSecundaria = (calle) => {
    const regex = /^[a-zA-Z0-9\s\-.,]+$/; // Permitir letras, números, espacios, guiones, puntos y comas
  
    if (!regex.test(calle)) {
      return 'La calle secundaria solo puede contener letras, números, espacios, guiones, puntos y comas';
    }
    if (calle.trim().length < 5) {
      return 'La calle secundaria es demasiado corta';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };  

  // Función de validación para el número de casa
const validateNumeroCasa = (numeroCasa) => {
    const regex = /^[a-zA-Z0-9\s\-#]+$/; // Permitir letras, números, espacios, guiones y el símbolo '#'
  
    if (!regex.test(numeroCasa)) {
      return 'El número de casa solo puede contener letras, números, espacios, guiones y el símbolo #';
    }
    if (numeroCasa.trim().length < 2) {
      return 'El número de casa es demasiado corto';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

  // Función de validación para el código postal
const validateCodigoPostal = (codigoPostal) => {
    const regex = /^[a-zA-Z0-9\s\-]+$/; // Permite letras, números, espacios y guiones
  
    if (!regex.test(codigoPostal)) {
      return 'El código postal solo puede contener letras, números, espacios y guiones';
    }
    if (codigoPostal.trim().length < 3) {
      return 'El código postal es demasiado corto';
    }
    return ''; // Si pasa todas las validaciones, retorna una cadena vacía
  };

  const calcularEdad = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  useEffect(() => {
    fetchCliente();
    fetchDirecciones();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {cliente && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', marginLeft: '16px' }}>
          <Avatar
            src={cliente.foto_cliente ? `data:image/jpeg;base64,${cliente.foto_cliente}` : "/default-avatar.png"}
            alt={cliente.nombre}
            style={{ width: 120, height: 120, marginRight: '24px' }}
          />
          <div style={{ textAlign: 'left' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {cliente.nombre}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '4px', fontSize: '1.2rem' }}>
              Edad: {cliente.fecha_nacimiento ? calcularEdad(cliente.fecha_nacimiento) : 'Desconocida'}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '4px', fontSize: '1.2rem' }}>
              Teléfono: {cliente.telefono}
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '4px', fontSize: '1.2rem' }}>
              Email: {cliente.email}
            </Typography>
          </div>
        </div>
      )}

      <Typography variant="h4" style={{ margin: '16px' }}>Direcciones del Cliente</Typography>
      <div style={{ textAlign: 'right', marginRight: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginBottom: '16px' }}>
          Nuevo
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Agregar Nueva Dirección</DialogTitle>
  <DialogContent>
    <form onSubmit={handleSubmit}>
    <FormControl fullWidth margin="normal" error={!!tipoDireccionError}>
        <InputLabel id="tipo-direccion-label">Tipo de Dirección</InputLabel>
        <Select
          labelId="tipo-direccion-label"
          name="id_tipo_direccion"
          value={newDireccion.id_tipo_direccion}
          onChange={handleInputChange}
          label="Tipo de Dirección"
        >
          <MenuItem value={1}>Domicilio</MenuItem>
          <MenuItem value={2}>Casa</MenuItem>
          <MenuItem value={3}>Oficina</MenuItem>
          <MenuItem value={4}>Otro</MenuItem>
        </Select>
        {tipoDireccionError && <FormHelperText>{tipoDireccionError}</FormHelperText>}
      </FormControl>
      <TextField
        label="País"
        name="pais"
        value={newDireccion.pais}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!paisError}
        helperText={paisError}
      />
      <TextField
        label="Provincia"
        name="provincia"
        value={newDireccion.provincia}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!provinciaError}
        helperText={provinciaError}
      />
      <TextField
        label="Ciudad"
        name="ciudad"
        value={newDireccion.ciudad}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!ciudadError}
        helperText={ciudadError}
      />
      <TextField
        label="Calle Principal"
        name="calle_principal"
        value={newDireccion.calle_principal}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!callePrincipalError}
        helperText={callePrincipalError}
      />
      <TextField
        label="Calle Secundaria"
        name="calle_secundaria"
        value={newDireccion.calle_secundaria}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!calleSecundariaError}
        helperText={calleSecundariaError}
      />
      <TextField
        label="Número de Casa"
        name="numero_casa"
        value={newDireccion.numero_casa}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!numeroCasaError}
        helperText={numeroCasaError}
      />
      <TextField
        label="Código Postal"
        name="codigo_postal"
        value={newDireccion.codigo_postal}
        onChange={handleInputChange} 
        fullWidth
        margin="normal"
        error={!!codigoPostalError}
        helperText={codigoPostalError}
      />
      <TextField
        label="Punto de Referencia"
        name="punto_referencia"
        value={newDireccion.punto_referencia}
        onChange={(e) => setNewDireccion({ ...newDireccion, punto_referencia: e.target.value })}
        fullWidth
        margin="normal"
      />
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancelar
        </Button>
        <Button type="submit" color="primary">
          Crear
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo de Dirección</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Provincia</TableCell>
              <TableCell>Ciudad</TableCell>
              <TableCell>Calle Principal</TableCell>
              <TableCell>Calle Secundaria</TableCell>
              <TableCell>Código Postal</TableCell>
              <TableCell>Punto de Referencia</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {direcciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No hay direcciones registradas.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              direcciones.map((direccion) => (
                <TableRow key={direccion.id_direccion}>
                  <TableCell>{direccion.tipo}</TableCell>
                  <TableCell>{direccion.pais}</TableCell>
                  <TableCell>{direccion.provincia}</TableCell>
                  <TableCell>{direccion.ciudad}</TableCell>
                  <TableCell>{direccion.calle_principal}</TableCell>
                  <TableCell>{direccion.calle_secundaria}</TableCell>
                  <TableCell>{direccion.codigo_postal}</TableCell>
                  <TableCell>{direccion.punto_referencia}</TableCell>
                  <TableCell>
                  <Button 
                      variant="contained" 
                      color="error" 
                      style={{ marginLeft: '10px' }} 
                      onClick={() => handleDelete(direccion.id_direccion)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DireccionesCliente;
