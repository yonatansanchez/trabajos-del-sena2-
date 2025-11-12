import { AppError, NotFoundError } from '../utils/errors/customErrors.js';

export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`No se puede encontrar ${req.originalUrl} en este servidor`));
};

const handleValidationError = (err) => {
  const errors = Object.values(err.details).map(el => el.msg);
  const message = `Datos de entrada no válidos. ${errors.join('. ')}`;
  return new AppError(message, 422);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    details: err.details
  });
};

const sendErrorProd = (err, res) => {
  // Errores operacionales, de confianza: enviar mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details
    });
  // Errores de programación o desconocidos: no filtrar detalles de error al cliente
  } else {
    // 1) Registrar el error
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);

    // 2) Enviar respuesta genérica
    res.status(500).json({
      status: 'error',
      message: 'Algo salió muy mal.'
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (error.name === 'ValidationError') error = handleValidationError(error);
    
    sendErrorProd(error, res);
  }
};
