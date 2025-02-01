// validators.js

export const validateClient = (client) => {
    const errors = {};
  
    if (!client.nombre) {
      errors.nombre = 'El nombre es obligatorio';
    }
  
    if (!client.apellido) {
      errors.apellido = 'El apellido es obligatorio';
    }
  
    if (!client.cedula) {
      errors.cedula = 'La cédula es obligatoria';
    }
  
    if (!client.email) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(client.email)) {
      errors.email = 'El email no es válido';
    }
  
    if (!client.telefono) {
      errors.telefono = 'El teléfono es obligatorio';
    }
  
    if (!client.fecha_nacimiento) {
      errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    }
  
    if (!client.genero) {
      errors.genero = 'El género es obligatorio';
    }
  
    return errors;
  };
  