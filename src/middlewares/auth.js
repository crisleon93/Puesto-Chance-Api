const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { buscarPorId } = require('../services/authService');
const AppError = require('../utils/AppError');

/**
 * Middleware de autenticación JWT.
 *
 * Extrae el token del encabezado `Authorization: Bearer <token>`,
 * lo verifica con la clave secreta y adjunta el objeto de usuario
 * completo en `req.usuario` para su uso en los controladores.
 *
 * @param {import('express').Request}  req  - Objeto de solicitud HTTP.
 * @param {import('express').Response} res  - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware.
 * @returns {void} Llama a `next()` si el token es válido, o a `next(AppError)` si no.
 * @throws {AppError} 401 si falta el token, el usuario no existe/está inactivo
 *                        o el token ha expirado o es inválido.
 */
function autenticar(req, res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) return next(new AppError('Token requerido', 401));

  try {
    const payload = jwt.verify(token, jwtSecret);
    const usuario = buscarPorId(payload.id);
    if (!usuario || !usuario.activo) return next(new AppError('Usuario no válido', 401));
    req.usuario = usuario;
    next();
  } catch (e) {
    next(new AppError('Token inválido o expirado', 401));
  }
}

/**
 * Middleware de autorización basado en roles (RBAC).
 *
 * Fábrica de middlewares: recibe una lista de roles permitidos y retorna
 * una función middleware que verifica si el usuario autenticado (`req.usuario`)
 * posee alguno de esos roles.
 *
 * Debe usarse **después** de `autenticar` en la cadena de middlewares.
 *
 * @param {...string} roles - Roles permitidos para acceder al recurso (ej. `'ADMIN'`, `'VENDEDOR'`).
 * @returns {import('express').RequestHandler} Middleware que permite o deniega el acceso.
 * @throws {AppError} 403 si el rol del usuario no está en la lista permitida.
 *
 * @example
 * // Solo los administradores pueden crear sorteos
 * router.post('/sorteos', autenticar, permitir('ADMIN'), sorteos.crear);
 */
const permitir = (...roles) => (req, res, next) =>
  roles.includes(req.usuario.rol) ? next() : next(new AppError('No tiene permisos para esta acción', 403));

module.exports = { autenticar, permitir };
