const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Puesto de Chance API',
      version: '1.0.0',
      description:
        'API REST para gestión de un puesto de venta de chance y Baloto. ' +
        'Permite autenticar usuarios, crear sorteos, vender y anular tiquetes, ' +
        'liquidar premios y realizar cierres de caja diarios.',
      contact: {
        name: 'SENA - Proyecto Académico 2026',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT obtenido en /api/v1/auth/login',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['usuario', 'password'],
          properties: {
            usuario: { type: 'string', example: 'vendedor1' },
            password: { type: 'string', example: 'vende123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9...' },
            usuario: { $ref: '#/components/schemas/Usuario' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            usuario: { type: 'string', example: 'vendedor1' },
            nombre: { type: 'string', example: 'Ana Pérez' },
            rol: { type: 'string', enum: ['ADMIN', 'VENDEDOR'], example: 'VENDEDOR' },
          },
        },
        Sorteo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            tipo: { type: 'string', enum: ['CHANCE', 'BALOTO'] },
            nombre: { type: 'string', example: 'Lotería de Bogotá' },
            fecha: { type: 'string', format: 'date-time' },
            estado: { type: 'string', enum: ['ABIERTO', 'JUGADO'], example: 'ABIERTO' },
            resultado: { type: 'string', nullable: true, example: '1234' },
            acumulado: { type: 'integer', example: 4500000000 },
          },
        },
        CrearSorteoRequest: {
          type: 'object',
          required: ['tipo', 'nombre', 'fecha'],
          properties: {
            tipo: { type: 'string', enum: ['CHANCE', 'BALOTO'], example: 'CHANCE' },
            nombre: { type: 'string', example: 'Lotería del Valle' },
            fecha: { type: 'string', format: 'date-time', example: '2026-11-15T22:00:00.000Z' },
            acumulado: { type: 'integer', example: 0 },
          },
        },
        ApuestaChance: {
          type: 'object',
          required: ['numero', 'valor'],
          properties: {
            numero: { type: 'string', example: '1234', description: '1 a 4 dígitos' },
            modalidad: { type: 'string', enum: ['DIRECTO', 'COMBINADO'], default: 'DIRECTO' },
            valor: { type: 'integer', example: 2000, description: 'Múltiplo de 100, entre 500 y 50000' },
          },
        },
        JugadaBaloto: {
          type: 'object',
          properties: {
            numeros: {
              type: 'array',
              items: { type: 'integer', minimum: 1, maximum: 43 },
              example: [3, 15, 22, 37, 41],
            },
            superbalota: { type: 'integer', minimum: 1, maximum: 16, example: 9 },
            aleatoria: { type: 'boolean', example: true, description: 'Si es true, genera números aleatorios' },
          },
        },
        VenderChanceRequest: {
          type: 'object',
          required: ['sorteoId', 'apuestas'],
          properties: {
            sorteoId: { type: 'integer', example: 1 },
            cliente: { type: 'string', example: 'Carlos Ruiz' },
            apuestas: {
              type: 'array',
              items: { $ref: '#/components/schemas/ApuestaChance' },
              minItems: 1,
              maxItems: 5,
            },
          },
        },
        VenderBalotoRequest: {
          type: 'object',
          required: ['sorteoId', 'jugadas'],
          properties: {
            sorteoId: { type: 'integer', example: 3 },
            cliente: { type: 'string', example: 'María López' },
            jugadas: {
              type: 'array',
              items: { $ref: '#/components/schemas/JugadaBaloto' },
              minItems: 1,
              maxItems: 10,
            },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            codigo: { type: 'string', example: 'CH-A1B2C3D4' },
            tipo: { type: 'string', enum: ['CHANCE', 'BALOTO'] },
            sorteoId: { type: 'integer' },
            vendedorId: { type: 'integer' },
            cliente: { type: 'string', nullable: true },
            total: { type: 'integer', example: 3000 },
            estado: { type: 'string', enum: ['ACTIVO', 'ANULADO', 'PAGADO', 'CADUCADO'] },
            premio: { type: 'integer', nullable: true },
            creadoEn: { type: 'string', format: 'date-time' },
          },
        },
        ResumenCaja: {
          type: 'object',
          properties: {
            vendedorId: { type: 'integer' },
            fecha: { type: 'string', example: '2026-11-12' },
            tiquetesVendidos: { type: 'integer' },
            tiquetesAnulados: { type: 'integer' },
            ventasChance: { type: 'integer' },
            ventasBaloto: { type: 'integer' },
            totalVendido: { type: 'integer' },
            premiosPagados: { type: 'integer' },
            totalPagado: { type: 'integer' },
            saldoEsperado: { type: 'integer' },
            cerrada: { type: 'boolean' },
          },
        },
        CierreCajaRequest: {
          type: 'object',
          required: ['efectivoReportado'],
          properties: {
            efectivoReportado: { type: 'integer', example: 45000 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciales inválidas' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Rutas donde swagger-jsdoc buscará anotaciones @swagger (no usamos, todo está aquí)
  apis: [],
};

// Definición manual de todos los paths
options.definition.paths = {
  '/health': {
    get: {
      tags: ['Sistema'],
      summary: 'Estado del servidor',
      security: [],
      responses: {
        200: {
          description: 'Servidor funcionando',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  estado: { type: 'string', example: 'ok' },
                  hora: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/login': {
    post: {
      tags: ['Autenticación'],
      summary: 'Iniciar sesión',
      description: 'Autentica al usuario y retorna un token JWT. Usuarios de prueba: **admin/admin123**, **vendedor1/vende123**, **vendedor2/vende456**',
      security: [],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
      },
      responses: {
        200: { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
        401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      },
    },
  },
  '/api/v1/auth/perfil': {
    get: {
      tags: ['Autenticación'],
      summary: 'Ver perfil del usuario autenticado',
      responses: {
        200: { description: 'Perfil del usuario', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
        401: { description: 'Token requerido o inválido' },
      },
    },
  },
  '/api/v1/sorteos': {
    get: {
      tags: ['Sorteos'],
      summary: 'Listar sorteos',
      parameters: [
        { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['CHANCE', 'BALOTO'] } },
        { name: 'estado', in: 'query', schema: { type: 'string', enum: ['ABIERTO', 'JUGADO'] } },
      ],
      responses: {
        200: { description: 'Lista de sorteos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Sorteo' } } } } },
      },
    },
    post: {
      tags: ['Sorteos'],
      summary: 'Crear sorteo (solo ADMIN)',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CrearSorteoRequest' } } },
      },
      responses: {
        201: { description: 'Sorteo creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Sorteo' } } } },
        400: { description: 'Datos inválidos' },
        403: { description: 'Solo ADMIN puede crear sorteos' },
      },
    },
  },
  '/api/v1/sorteos/{id}': {
    get: {
      tags: ['Sorteos'],
      summary: 'Obtener sorteo por ID',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      responses: {
        200: { description: 'Sorteo encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Sorteo' } } } },
        404: { description: 'Sorteo no encontrado' },
      },
    },
  },
  '/api/v1/sorteos/{id}/resultado': {
    post: {
      tags: ['Sorteos'],
      summary: 'Registrar resultado del sorteo (solo ADMIN)',
      description: 'Para CHANCE envíe un string de 4 dígitos. Para BALOTO envíe el objeto con numeros y superbalota.',
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                resultado: {
                  oneOf: [
                    { type: 'string', example: '1234', description: 'Resultado CHANCE (4 dígitos)' },
                    { $ref: '#/components/schemas/JugadaBaloto' },
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Resultado registrado y premios liquidados' },
        403: { description: 'Solo ADMIN' },
        409: { description: 'El sorteo ya fue jugado' },
      },
    },
  },
  '/api/v1/tickets/chance': {
    post: {
      tags: ['Tiquetes'],
      summary: 'Vender tiquete de chance (solo VENDEDOR)',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/VenderChanceRequest' } } },
      },
      responses: {
        201: { description: 'Tiquete creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } },
        400: { description: 'Apuesta inválida' },
        403: { description: 'Solo VENDEDOR puede vender' },
        409: { description: 'Ventas cerradas para este sorteo' },
      },
    },
  },
  '/api/v1/tickets/baloto': {
    post: {
      tags: ['Tiquetes'],
      summary: 'Vender tiquete de Baloto (solo VENDEDOR)',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/VenderBalotoRequest' } } },
      },
      responses: {
        201: { description: 'Tiquete creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ticket' } } } },
        403: { description: 'Solo VENDEDOR puede vender' },
      },
    },
  },
  '/api/v1/tickets': {
    get: {
      tags: ['Tiquetes'],
      summary: 'Listar tiquetes',
      description: 'ADMIN ve todos. VENDEDOR solo ve los suyos.',
      parameters: [
        { name: 'fecha', in: 'query', schema: { type: 'string', example: '2026-11-12' } },
        { name: 'estado', in: 'query', schema: { type: 'string', enum: ['ACTIVO', 'ANULADO', 'PAGADO', 'CADUCADO'] } },
      ],
      responses: {
        200: { description: 'Lista de tiquetes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ticket' } } } } },
      },
    },
  },
  '/api/v1/tickets/{codigo}': {
    get: {
      tags: ['Tiquetes'],
      summary: 'Consultar tiquete por código',
      parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string', example: 'CH-A1B2C3D4' } }],
      responses: {
        200: { description: 'Tiquete con datos del sorteo y resultado ganador' },
        404: { description: 'Tiquete no encontrado' },
      },
    },
  },
  '/api/v1/tickets/{codigo}/anular': {
    post: {
      tags: ['Tiquetes'],
      summary: 'Anular tiquete',
      description: 'Vendedor: solo puede anular sus propios tiquetes dentro de los 10 minutos de la venta. Admin: sin restricción de tiempo.',
      parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['motivo'],
              properties: { motivo: { type: 'string', example: 'Cliente cambió el número' } },
            },
          },
        },
      },
      responses: {
        200: { description: 'Tiquete anulado' },
        403: { description: 'No puede anular tiquetes de otro vendedor' },
        409: { description: 'Fuera de tiempo, sorteo ya jugado, o tiquete no activo' },
      },
    },
  },
  '/api/v1/tickets/{codigo}/pagar': {
    post: {
      tags: ['Tiquetes'],
      summary: 'Pagar premio (solo VENDEDOR)',
      parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        200: { description: 'Premio pagado exitosamente' },
        409: { description: 'Premio ya pagado, sorteo no jugado, o tiquete sin premio' },
        410: { description: 'Premio caducado (más de 365 días)' },
      },
    },
  },
  '/api/v1/caja/resumen': {
    get: {
      tags: ['Caja'],
      summary: 'Resumen de caja del día',
      description: 'ADMIN puede pasar `?vendedorId=` para ver la caja de otro vendedor.',
      parameters: [
        { name: 'vendedorId', in: 'query', schema: { type: 'integer' }, description: 'Solo para ADMIN' },
        { name: 'fecha', in: 'query', schema: { type: 'string', example: '2026-11-12' } },
      ],
      responses: {
        200: { description: 'Resumen de caja', content: { 'application/json': { schema: { $ref: '#/components/schemas/ResumenCaja' } } } },
      },
    },
  },
  '/api/v1/caja/cierre': {
    post: {
      tags: ['Caja'],
      summary: 'Cerrar caja del día (solo VENDEDOR)',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/CierreCajaRequest' } } },
      },
      responses: {
        201: { description: 'Cierre registrado con estado CUADRADA, SOBRANTE o FALTANTE' },
        409: { description: 'La caja ya fue cerrada hoy' },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
