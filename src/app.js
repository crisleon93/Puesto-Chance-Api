const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rutas = require('./routes');
const { noEncontrado, manejarErrores } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Documentación interactiva Swagger UI
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./docs/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Puesto de Chance API - Docs',
    swaggerOptions: { persistAuthorization: true },
  }));
  console.log('Swagger UI disponible en /api-docs');
} catch (e) {
  console.warn('Swagger no disponible:', e.message);
}

app.get('/health', (req, res) => res.json({ estado: 'ok', hora: new Date().toISOString() }));
app.use('/api/v1', rutas);

app.use(noEncontrado);
app.use(manejarErrores);

module.exports = app;
