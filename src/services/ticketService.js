const crypto = require('crypto');
const { getDb, nextId } = require('../data/store');
const AppError = require('../utils/AppError');
const chance = require('./chanceService');
const baloto = require('./balotoService');
const sorteos = require('./sorteoService');
const { valorBaloto, minutosAnulacion, diasCaducidadPremio } = require('../config');
const { minutosEntre, diasEntre } = require('../utils/fechas');

function generarCodigo(tipo) {
  const prefijo = tipo === 'CHANCE' ? 'CH' : 'BL';
  return `${prefijo}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function guardar(ticket) {
  getDb().tickets.push(ticket);
  return ticket;
}

/**
 * Registra la venta de un tiquete de chance para el sorteo indicado.
 *
 * Pasos de validación:
 * - Verifica que el sorteo exista y sea del tipo CHANCE.
 * - Comprueba que las ventas no estén cerradas (`verificarVentaPermitida`).
 * - Valida cada apuesta individualmente (número, modalidad, valor, múltiplo de 100).
 * - Acepta entre 1 y 5 apuestas por tiquete.
 *
 * @param {{ id: number, rol: string }} vendedor            - Usuario autenticado que realiza la venta.
 * @param {{ sorteoId: number,
 *           apuestas: Array<{ numero: string, modalidad?: string, valor: number }>,
 *           cliente?: string }} body                       - Cuerpo de la petición HTTP.
 * @returns {Object} Tiquete creado con código único, apuestas validadas y total.
 * @throws {AppError} 400 si las apuestas son inválidas, 404 si el sorteo no existe,
 *                    409 si las ventas del sorteo están cerradas.
 *
 * @example
 * const ticket = venderChance(
 *   { id: 2, rol: 'VENDEDOR' },
 *   { sorteoId: 1, apuestas: [{ numero: '1234', valor: 2000 }] }
 * );
 * // { codigo: 'CH-A1B2C3D4', tipo: 'CHANCE', total: 2000, estado: 'ACTIVO', ... }
 */
function venderChance(vendedor, { sorteoId, apuestas, cliente }) {
  const sorteo = sorteos.obtener(sorteoId);
  sorteos.verificarVentaPermitida(sorteo, 'CHANCE');

  if (!Array.isArray(apuestas) || apuestas.length === 0 || apuestas.length > 5) {
    throw new AppError('Un tiquete de chance debe tener entre 1 y 5 apuestas');
  }
  const validas = apuestas.map(chance.validarApuesta);

  return guardar({
    id: nextId('tickets'),
    codigo: generarCodigo('CHANCE'),
    tipo: 'CHANCE',
    sorteoId: sorteo.id,
    vendedorId: vendedor.id,
    cliente: cliente || null,
    apuestas: validas,
    total: validas.reduce((s, a) => s + a.valor, 0),
    estado: 'ACTIVO',
    premio: null,
    creadoEn: new Date().toISOString(),
  });
}

function venderBaloto(vendedor, { sorteoId, jugadas, cliente }) {
  const sorteo = sorteos.obtener(sorteoId);
  sorteos.verificarVentaPermitida(sorteo, 'BALOTO');

  if (!Array.isArray(jugadas) || jugadas.length === 0 || jugadas.length > 10) {
    throw new AppError('Un tiquete de Baloto debe tener entre 1 y 10 jugadas');
  }
  const validas = jugadas.map(baloto.validarJugada);

  return guardar({
    id: nextId('tickets'),
    codigo: generarCodigo('BALOTO'),
    tipo: 'BALOTO',
    sorteoId: sorteo.id,
    vendedorId: vendedor.id,
    cliente: cliente || null,
    jugadas: validas,
    total: validas.length * valorBaloto,
    estado: 'ACTIVO',
    premio: null,
    creadoEn: new Date().toISOString(),
  });
}

function buscar(codigo) {
  const ticket = getDb().tickets.find((t) => t.codigo === codigo);
  if (!ticket) throw new AppError('Tiquete no encontrado', 404);
  return ticket;
}

function listar(usuario, { fecha, estado } = {}) {
  return getDb().tickets.filter((t) =>
    (usuario.rol === 'ADMIN' || t.vendedorId === usuario.id) &&
    (!estado || t.estado === estado) &&
    (!fecha || t.creadoEn.startsWith(fecha)));
}

function consultar(codigo) {
  const ticket = buscar(codigo);
  const sorteo = sorteos.obtener(ticket.sorteoId);
  return {
    ...ticket,
    sorteo: { id: sorteo.id, nombre: sorteo.nombre, fecha: sorteo.fecha, estado: sorteo.estado, resultado: sorteo.resultado },
    ganador: sorteo.estado === 'JUGADO' ? ticket.premio > 0 : null,
  };
}

/**
 * Anula un tiquete activo aplicando las siguientes reglas de negocio:
 *
 * 1. Solo el vendedor propietario puede anular (a menos que sea ADMIN).
 * 2. El tiquete debe estar en estado `ACTIVO`.
 * 3. El sorteo asociado no puede haber sido jugado.
 * 4. Los vendedores solo pueden anular dentro de la ventana de tiempo configurada
 *    (`MINUTOS_ANULACION`). Los admins no tienen restricción de tiempo.
 * 5. El motivo de anulación es obligatorio.
 *
 * @param {string} codigo                       - Código único del tiquete (ej. `CH-A1B2C3D4`).
 * @param {{ id: number, rol: string }} usuario - Usuario autenticado que solicita la anulación.
 * @param {string} motivo                       - Descripción obligatoria del motivo de anulación.
 * @returns {Object} Tiquete con estado actualizado a `ANULADO` y registro de anulación.
 * @throws {AppError} 403 si el vendedor intenta anular un tiquete ajeno,
 *                    404 si el tiquete no existe,
 *                    409 si el tiquete ya fue anulado, el sorteo fue jugado
 *                        o se superó la ventana de tiempo.
 *                    400 si no se proporciona motivo.
 */
function anular(codigo, usuario, motivo) {
  const ticket = buscar(codigo);

  if (usuario.rol !== 'ADMIN' && ticket.vendedorId !== usuario.id) {
    throw new AppError('No puede anular tiquetes de otro vendedor', 403);
  }
  if (ticket.estado !== 'ACTIVO') throw new AppError(`El tiquete está ${ticket.estado}`, 409);
  if (sorteos.obtener(ticket.sorteoId).estado === 'JUGADO') {
    throw new AppError('No se puede anular un tiquete de un sorteo jugado', 409);
  }
  if (usuario.rol !== 'ADMIN' && minutosEntre(ticket.creadoEn) > minutosAnulacion) {
    throw new AppError(`Solo se puede anular dentro de los ${minutosAnulacion} minutos siguientes a la venta`, 409);
  }
  if (!motivo) throw new AppError('Debe indicar el motivo de anulación');

  ticket.estado = 'ANULADO';
  ticket.anulacion = { usuarioId: usuario.id, motivo, fecha: new Date().toISOString() };
  return ticket;
}

function pagarPremio(codigo, usuario) {
  const ticket = buscar(codigo);
  const sorteo = sorteos.obtener(ticket.sorteoId);

  if (sorteo.estado !== 'JUGADO') throw new AppError('El sorteo aún no se ha jugado', 409);
  if (ticket.estado === 'PAGADO') throw new AppError('El premio ya fue pagado', 409);
  if (ticket.estado !== 'ACTIVO') throw new AppError(`El tiquete está ${ticket.estado}`, 409);
  if (!ticket.premio) throw new AppError('El tiquete no tiene premio', 409);
  if (diasEntre(sorteo.jugadoEn) > diasCaducidadPremio) {
    ticket.estado = 'CADUCADO';
    throw new AppError('El premio está caducado', 410);
  }

  const pago = {
    id: nextId('pagos'),
    ticketId: ticket.id,
    codigo: ticket.codigo,
    usuarioId: usuario.id,
    valor: ticket.premio,
    fecha: new Date().toISOString(),
  };
  getDb().pagos.push(pago);
  ticket.estado = 'PAGADO';
  return pago;
}

module.exports = { venderChance, venderBaloto, consultar, listar, anular, pagarPremio };
