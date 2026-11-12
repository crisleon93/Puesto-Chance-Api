const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../data/store');
const { jwtSecret, jwtExpiresIn } = require('../config');
const AppError = require('../utils/AppError');

/**
 * Autentica a un usuario con sus credenciales y emite un token JWT.
 *
 * Flujo:
 * 1. Valida que se reciban usuario y contraseña.
 * 2. Busca al usuario en la base de datos en memoria.
 * 3. Compara la contraseña con el hash almacenado usando bcrypt.
 * 4. Verifica que la cuenta esté activa.
 * 5. Firma un JWT con el id y rol del usuario.
 *
 * @param {string} usuario   - Nombre de usuario (campo `usuario` del store).
 * @param {string} password  - Contraseña en texto plano para comparar con el hash.
 * @returns {{ token: string, usuario: Object }} Token JWT y datos públicos del usuario.
 * @throws {AppError} 400 si faltan campos, 401 si las credenciales son inválidas,
 *                    403 si la cuenta está inactiva.
 *
 * @example
 * const resultado = login('vendedor1', 'vende123');
 * // { token: 'eyJ...', usuario: { id: 2, rol: 'VENDEDOR', ... } }
 */
function login(usuario, password) {
  if (!usuario || !password) throw new AppError('Usuario y contraseña son obligatorios');

  const encontrado = getDb().usuarios.find((u) => u.usuario === usuario);
  if (!encontrado || !bcrypt.compareSync(password, encontrado.password)) {
    throw new AppError('Credenciales inválidas', 401);
  }
  if (!encontrado.activo) throw new AppError('Usuario inactivo', 403);

  const token = jwt.sign({ id: encontrado.id, rol: encontrado.rol }, jwtSecret, { expiresIn: jwtExpiresIn });
  return { token, usuario: perfil(encontrado) };
}

/**
 * Proyecta los campos públicos de un usuario, omitiendo datos sensibles como el hash
 * de la contraseña.
 *
 * @param {{ id: number, usuario: string, nombre: string, rol: string }} u - Objeto completo de usuario del store.
 * @returns {{ id: number, usuario: string, nombre: string, rol: string }} Datos seguros para exponer en la API.
 */
function perfil(u) {
  return { id: u.id, usuario: u.usuario, nombre: u.nombre, rol: u.rol };
}

/**
 * Busca un usuario en la base de datos por su ID numérico.
 * Usado principalmente por el middleware de autenticación JWT para rehidratar
 * el objeto de usuario a partir del payload del token.
 *
 * @param {number} id - ID único del usuario.
 * @returns {Object|undefined} Objeto de usuario si existe, `undefined` si no se encuentra.
 */
function buscarPorId(id) {
  return getDb().usuarios.find((u) => u.id === id);
}

module.exports = { login, perfil, buscarPorId };
