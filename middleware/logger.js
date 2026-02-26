/**
 * @fileoverview Middleware reutilizable de logging (principio DRY).
 * Registra en consola el método HTTP, la URL y la fecha/hora ISO de cada petición.
 * @module middleware/logger
 */

/**
 * Middleware que imprime información de cada petición entrante.
 *
 * @param {import('express').Request}  req  - Objeto request de Express.
 * @param {import('express').Response} res  - Objeto response de Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * @returns {void}
 *
 * @example
 * // Uso global en app.js:
 * const logger = require('./middleware/logger');
 * app.use(logger);
 */
const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
};

module.exports = logger;
