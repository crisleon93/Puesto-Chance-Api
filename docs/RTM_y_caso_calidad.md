# Matriz de Trazabilidad de Requisitos (RTM)
# Puesto de Chance API — SENA 2026

---

## ¿Qué es la Matriz de Trazabilidad?

La **Matriz de Trazabilidad de Requisitos (RTM, Requirements Traceability Matrix)** es un artefacto de calidad que vincula formalmente cada Historia de Usuario con el módulo de código que la implementa y el caso de prueba que la valida. Su propósito es garantizar que:

- **Ningún requisito quede sin implementar.**
- **Ningún requisito quede sin probar.**
- Cualquier cambio en un requisito permita identificar qué código y pruebas deben actualizarse.

---

## Tabla de Trazabilidad

| ID HU | Descripción del Requisito | Módulo / Archivo | Función / Método | Caso de Prueba | Estado QA |
|-------|---------------------------|------------------|-----------------|----------------|-----------|
| HU-001 | Autenticación de usuarios con usuario y contraseña | `src/services/authService.js` | `login()` | `test_login_exitoso` _(auth.test.js)_ | ✅ Aprobado |
| HU-002 | Rechazo de credenciales inválidas | `src/services/authService.js` | `login()` | `test_login_credenciales_invalidas` _(auth.test.js)_ | ✅ Aprobado |
| HU-003 | Protección de rutas con JWT | `src/middlewares/auth.js` | `autenticar()` | `test_ruta_protegida_sin_token` _(auth.test.js)_ | ✅ Aprobado |
| HU-004 | Venta de tiquete de chance (1–5 apuestas) | `src/services/ticketService.js` | `venderChance()` | `test_venta_chance` _(tickets.test.js)_ | ✅ Aprobado |
| HU-005 | Venta de tiquete de Baloto (1–10 jugadas) | `src/services/ticketService.js` | `venderBaloto()` | `test_venta_baloto` _(tickets.test.js)_ | ✅ Aprobado |
| HU-006 | Bloqueo de ventas cuando el sorteo está próximo | `src/services/sorteoService.js` | `verificarVentaPermitida()` | `test_venta_sorteo_cerrado` _(tickets.test.js)_ | ✅ Aprobado |
| HU-007 | Solo VENDEDOR puede vender tiquetes (RBAC) | `src/middlewares/auth.js` | `permitir()` | `test_admin_no_vende` _(tickets.test.js)_ | ✅ Aprobado |
| HU-008 | Anulación de tiquete dentro de la ventana de tiempo | `src/services/ticketService.js` | `anular()` | `test_anulacion_ticket` _(tickets.test.js)_ | ✅ Aprobado |
| HU-009 | Restricción de anulación fuera de la ventana de tiempo | `src/services/ticketService.js` | `anular()` | `test_anulacion_fuera_de_tiempo` _(tickets.test.js)_ | ✅ Aprobado |
| HU-010 | Registro del resultado del sorteo y liquidación de premios | `src/services/sorteoService.js` | `registrarResultado()` | `test_resultado_y_pago_premio` _(tickets.test.js)_ | ✅ Aprobado |
| HU-011 | Pago de premio a tiquete ganador | `src/services/ticketService.js` | `pagarPremio()` | `test_resultado_y_pago_premio` _(tickets.test.js)_ | ✅ Aprobado |
| HU-012 | Bloqueo de pago doble de un mismo premio | `src/services/ticketService.js` | `pagarPremio()` | `test_resultado_y_pago_premio` _(tickets.test.js)_ | ✅ Aprobado |
| HU-013 | Resumen diario de caja por vendedor | `src/services/cajaService.js` | `resumen()` | `test_resumen_caja_diario` _(caja.test.js)_ | ✅ Aprobado |
| HU-014 | Cierre de caja con detección de faltante/sobrante | `src/services/cajaService.js` | `cerrar()` | `test_cierre_caja_con_faltante` _(caja.test.js)_ | ✅ Aprobado |
| HU-015 | Bloqueo de doble cierre de caja en el mismo día | `src/services/cajaService.js` | `cerrar()` | `test_cierre_caja_con_faltante` _(caja.test.js)_ | ✅ Aprobado |
| HU-016 | Creación de nuevos sorteos por ADMIN | `src/services/sorteoService.js` | `crear()` | `test_admin_crea_sorteo` _(caja.test.js)_ | ✅ Aprobado |
| HU-017 | Validación de apuestas de chance (número, valor, modalidad) | `src/services/chanceService.js` | `validarApuesta()` | `test_validacion_apuesta_invalida` _(chance.test.js)_ | ✅ Aprobado |
| HU-018 | Cálculo de premio chance directo por cifras | `src/services/chanceService.js` | `calcularPremio()` | `test_premio_directo_4_cifras` _(chance.test.js)_ | ✅ Aprobado |
| HU-019 | Cálculo de premio chance por últimas cifras | `src/services/chanceService.js` | `calcularPremio()` | `test_premio_directo_ultimas_cifras` _(chance.test.js)_ | ✅ Aprobado |
| HU-020 | Premio combinado dividido por número de permutaciones | `src/services/chanceService.js` | `calcularPremio()` | `test_premio_combinado_divide_por_permutaciones` _(chance.test.js)_ | ✅ Aprobado |
| HU-021 | Generación de jugada aleatoria de Baloto | `src/services/balotoService.js` | `generarAleatoria()` | `test_jugada_aleatoria_valida` _(baloto.test.js)_ | ✅ Aprobado |
| HU-022 | Rechazo de jugadas de Baloto con números repetidos o fuera de rango | `src/services/balotoService.js` | `validarJugada()` | `test_jugada_numeros_repetidos` _(baloto.test.js)_ | ✅ Aprobado |
| HU-023 | Cálculo correcto de premios de Baloto por nivel de aciertos | `src/services/balotoService.js` | `calcularPremio()` | `test_premio_por_aciertos` _(baloto.test.js)_ | ✅ Aprobado |

---

## Resumen de cobertura

| Categoría | Total HU | Aprobadas | Pendientes | Fallidas |
|-----------|:--------:|:---------:|:----------:|:--------:|
| Autenticación y seguridad | 3 | 3 | 0 | 0 |
| Tiquetes (venta / anulación / pago) | 9 | 9 | 0 | 0 |
| Caja | 3 | 3 | 0 | 0 |
| Sorteos | 2 | 2 | 0 | 0 |
| Reglas de Chance | 4 | 4 | 0 | 0 |
| Reglas de Baloto | 3 | 3 | 0 | 0 |
| **TOTAL** | **23** | **23** | **0** | **0** |

---

---

# Caso Real: Problemas por Falta de Documentación y Trazabilidad en Software

---

## Caso: Boeing 737 MAX — Sistema MCAS (2018–2019)

### Descripción del incidente

El sistema **MCAS (Maneuvering Characteristics Augmentation System)** del Boeing 737 MAX fue un software de control de vuelo que empujaba automáticamente el morro del avión hacia abajo cuando detectaba un ángulo de ataque excesivo, para compensar cambios aerodinámicos del nuevo modelo. Dos accidentes —**Lion Air vuelo 610** (octubre 2018, 189 víctimas) y **Ethiopian Airlines vuelo 302** (marzo 2019, 157 víctimas)— resultaron en 346 muertes y la inmovilización mundial de toda la flota del 737 MAX durante casi dos años.

Las investigaciones del **NTSB**, la **FAA** y la **Junta de Revisión Conjunta de Autoridades** revelaron que la raíz del problema no era únicamente técnica, sino **documental y de trazabilidad**.

### ¿Qué falló en la documentación y la trazabilidad?

#### 1. Cambio de requisitos no documentado ni trazado

Durante el diseño, el MCAS fue expandido para actuar con **mayor autoridad de control** (podía mover la superficie estabilizadora hasta 2,5 veces más de lo originalmente documentado). Este cambio **nunca fue reflejado en los documentos de requisitos del sistema ni en los manuales de vuelo** entregados a pilotos y aerolíneas. Los pilotos ni siquiera sabían que el MCAS existía.

**Qué faltó:** Una RTM actualizada que hubiera vinculado el cambio de requisito funcional del MCAS con los documentos de operación, los casos de prueba de regresión y los manuales de usuario.

#### 2. Ausencia de trazabilidad entre requisito y prueba

La FAA delegó parte de la certificación a Boeing. Los documentos de prueba enviados a la FAA describían una versión del MCAS con autoridad limitada. La versión con mayor autoridad **nunca fue probada ni certificada formalmente** porque no existía una traza que conectara el cambio de código con un nuevo caso de prueba y un nuevo proceso de aprobación regulatoria.

**Qué faltó:** Control de versiones de requisitos con trazabilidad bidireccional: de requisito → código → prueba → aprobación regulatoria.

#### 3. Documentación de código insuficiente

Los ingenieros de software del MCAS no documentaron con claridad las condiciones de activación, los límites de actuación ni los efectos en cadena cuando el sensor de ángulo de ataque fallaba. Esto dificultó el diagnóstico en tiempo real durante los accidentes y retrasó la comprensión del problema durante la investigación.

**Qué faltó:** Comentarios técnicos (equivalentes a JSDoc) en las funciones críticas de control, con sus precondiciones, postcondiciones y manejo de fallos del sensor.

#### 4. Proceso de gestión de cambios roto

No existía un proceso formal que obligara a notificar a la FAA cuando un cambio de software superaba ciertos umbrales de impacto en la seguridad. La documentación de impacto del cambio simplemente **no fue creada**.

**Qué faltó:** Un proceso de gestión de cambios con documentación obligatoria de impacto, revisión por pares y actualización de la RTM antes de aprobar cualquier cambio en software crítico de seguridad.

### ¿Qué costo generó la falta de documentación?

| Consecuencia | Dimensión |
|-------------|-----------|
| Vidas humanas | 346 fallecidos |
| Flota inmovilizada | ~800 aeronaves durante 20 meses |
| Pérdida económica de Boeing | ~USD 20.000 millones en compensaciones, multas y costos de rediseño |
| Multa del DOJ (EE.UU.) | USD 2.500 millones (acuerdo de enjuiciamiento diferido, 2021) |
| Daño reputacional | Pérdida de contratos, caída del precio de la acción |

### Lecciones aplicadas al desarrollo de software general

| Mala práctica detectada en Boeing | Buena práctica que lo habría prevenido |
|-----------------------------------|----------------------------------------|
| Cambio de requisito sin actualizar RTM | Mantener la RTM como artefacto vivo; cualquier cambio en el código debe reflejarse en la matriz antes de hacer merge |
| Función crítica sin documentación técnica | Usar JSDoc / Docstring en cada función con lógica de negocio relevante, especificando parámetros, retornos y excepciones |
| Prueba no actualizada tras cambio de comportamiento | Exigir que todo cambio funcional venga acompañado de un caso de prueba nuevo o actualizado (práctica TDD/BDD) |
| Falta de visibilidad entre equipos | Usar herramientas de gestión (Jira, Azure DevOps) donde cada tarea enlace al requisito, al commit y a la prueba |
| Delegación de verificación sin supervisión | Auditorías periódicas de trazabilidad: verificar que cada HU tenga código y prueba asociados |

### Conclusión del análisis

El caso Boeing 737 MAX demuestra que **la falta de documentación y trazabilidad en software no es solo un problema de calidad académico**: puede tener consecuencias irreversibles en vidas humanas y en la sostenibilidad económica de una organización. En proyectos de menor escala los efectos son proporcionalmente menores, pero el patrón es idéntico: cambios no documentados, requisitos sin prueba y funciones sin comentarios técnicos generan deuda técnica que, eventualmente, se cobra con errores en producción, costos de corrección exponencialmente mayores y pérdida de confianza del cliente.

La **Matriz de Trazabilidad** no es burocracia: es el hilo que une la intención del negocio, el código que la implementa y la evidencia de que fue probada correctamente.

---

> **Fuentes:**
> - [Informe final NTSB — Lion Air vuelo 610 (2019)](https://www.ntsb.gov/)
> - [Informe de la Junta de Revisión Conjunta de Autoridades — Boeing 737 MAX (2019)](https://www.jatr-gov.com/)
> - [DOJ — Boeing Deferred Prosecution Agreement (2021)](https://www.justice.gov/opa/pr/boeing-company-enters-deferred-prosecution-agreement)
> - [House Committee on Transportation — Final Committee Report on Boeing 737 MAX (2020)](https://transportation.house.gov/)

_Documento elaborado para la actividad de Documentación y Trazabilidad — SENA 2026._
