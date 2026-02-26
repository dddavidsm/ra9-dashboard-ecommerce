/**
 * @fileoverview Archivo principal de la aplicación Express.
 * Configura middlewares, motor de plantillas EJS y conexión a MongoDB.
 * @module app
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/* ───────────────── Middlewares globales ───────────────── */

/**
 * Habilita CORS para peticiones desde cualquier origen.
 */
app.use(cors());

/**
 * Parsea cuerpos JSON entrantes.
 */
app.use(express.json());

/**
 * Parsea cuerpos URL-encoded (formularios).
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Sirve archivos estáticos desde la carpeta /public.
 */
app.use(express.static(path.join(__dirname, 'public')));

/* ───────────── Motor de plantillas (EJS) ─────────────── */

/**
 * Configura EJS como motor de vistas.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ──────────────── Conexión a MongoDB ─────────────────── */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ra9_dashboard';

/**
 * Conecta a la base de datos MongoDB mediante Mongoose.
 * @returns {Promise<void>}
 */
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

/* ──────────────────── Rutas ──────────────────────────── */

// (Se registrarán en los siguientes pasos)

/* ───────────────── Arranque del servidor ─────────────── */

const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor en el puerto configurado.
 * Solo arranca si el módulo se ejecuta directamente (no en tests).
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
