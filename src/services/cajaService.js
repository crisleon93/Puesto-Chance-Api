const { getDb, nextId } = require('../data/store');
const AppError = require('../utils/AppError');
const { fechaLocal } = require('../utils/fechas');

/**
 * Genera el resumen financiero de la caja para un vendedor en una fecha específica.
 *
 * Calcula:
 * - Total de tiquetes vendidos y anulados del día.
 * - Desglose de ventas por tipo (Chance / Baloto).
 * - Total de premios pagados.
 * - Saldo esperado en caja: `totalVendido - totalPagado`.
 * - Si la caja ya fue cerrada ese día.
 *
 * @param {number} vendedorId   - ID del usuario vendedor.
 * @param {string} [fecha]      - Fecha en formato `YYYY-MM-DD`. Si se omite, usa la fecha actual
 *                                en la zona horaria configurada (`ZONA_HORARIA`).
 * @returns {{
 *   vendedorId: number,
 *   fecha: string,
 *   tiquetesVendidos: number,
 *   tiquetesAnulados: number,
 *   ventasChance: number,
 *   ventasBaloto: number,
 *   totalVendido: number,
 *   premiosPagados: number,
 *   totalPagado: number,
 *   saldoEsperado: number,
 *   cerrada: boolean
 * }} Objeto con el resumen completo de la caja.
 */
function resumen(vendedorId, fecha = fechaLocal()) {
  const db = getDb();
  const delDia = (iso) => fechaLocal(iso) === fecha;

  const tickets = db.tickets.filter((t) => t.vendedorId === vendedorId && delDia(t.creadoEn));
  const validos = tickets.filter((t) => t.estado !== 'ANULADO');
  const pagos = db.pagos.filter((p) => p.usuarioId === vendedorId && delDia(p.fecha));

  const totalVendido = validos.reduce((s, t) => s + t.total, 0);
  const totalPagado = pagos.reduce((s, p) => s + p.valor, 0);

  return {
    vendedorId,
    fecha,
    tiquetesVendidos: validos.length,
    tiquetesAnulados: tickets.length - validos.length,
    ventasChance: validos.filter((t) => t.tipo === 'CHANCE').reduce((s, t) => s + t.total, 0),
    ventasBaloto: validos.filter((t) => t.tipo === 'BALOTO').reduce((s, t) => s + t.total, 0),
    totalVendido,
    premiosPagados: pagos.length,
    totalPagado,
    saldoEsperado: totalVendido - totalPagado,
    cerrada: db.cierres.some((c) => c.vendedorId === vendedorId && c.fecha === fecha),
  };
}

function cerrar(vendedorId, { efectivoReportado, fecha = fechaLocal() }) {
  if (!Number.isInteger(efectivoReportado) || efectivoReportado < 0) {
    throw new AppError('El efectivo reportado debe ser un entero positivo');
  }
  const r = resumen(vendedorId, fecha);
  if (r.cerrada) throw new AppError('La caja de ese día ya fue cerrada', 409);

  const diferencia = efectivoReportado - r.saldoEsperado;
  const cierre = {
    id: nextId('cierres'),
    ...r,
    cerrada: true,
    efectivoReportado,
    diferencia,
    estado: diferencia === 0 ? 'CUADRADA' : diferencia > 0 ? 'SOBRANTE' : 'FALTANTE',
    creadoEn: new Date().toISOString(),
  };
  getDb().cierres.push(cierre);
  return cierre;
}

module.exports = { resumen, cerrar };
