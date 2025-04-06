/**
 * Formateador consistente de respuestas para todos los servicios
 */

exports.success = (data, message = 'Operación exitosa') => {
  return {
    status: 'success',
    message,
    data
  };
};

exports.error = (message, statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return response;
};

exports.paginated = (data, pagination) => {
  return {
    status: 'success',
    data,
    pagination
  };
};
