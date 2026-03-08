/**
 * @fileoverview Archivo principal de la aplicación Express.
 * @module app
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('./middleware/logger');

const app = express();

/*  Middlewares   */

app.use(logger);


app.use(cors());


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 * Sirve archivos estáticos desde la carpeta /public.
 */
app.use(express.static(path.join(__dirname, 'public')));

/* Plantillas (EJS) */

/**
 * Configura EJS como motor de vistas.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/*  Conexión a MongoDB  */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ra9_dashboard';

/**
 * Conecta a la base de datos MongoDB mediante Mongoose.
 * @returns {Promise<void>}
 */
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));


/* RUTAS */

const syncRoutes = require('./routes/sync');
const apiRoutes = require('./routes/api');
app.use(syncRoutes);
app.use(apiRoutes);


// Redirigir la ruta principal al dashboard
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

/**
 * GET /dashboard
 * Obtiene las estadísticas de la BD y renderiza la vista EJS del dashboard.
 */
app.get('/dashboard', async (req, res) => {
  try {
    const Product = require('./models/Product');

    const [result] = await Product.aggregate([
      {
        $facet: {
          totalProducts: [{ $count: 'count' }],
          avgPrice: [{ $group: { _id: null, avg: { $avg: '$price' } } }],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const stats = {
      totalProducts: result.totalProducts[0]?.count || 0,
      avgPrice: parseFloat((result.avgPrice[0]?.avg || 0).toFixed(2)),
      byCategory: result.byCategory,
    };

    res.render('dashboard', { stats });
  } catch (error) {
    console.error('❌ Error en /dashboard:', error.message);
    res.status(500).send('Error al cargar el dashboard.');
  }
});
/**
 * GET /api/productos
 * Devuelve un JSON con la lista de todos los productos almacenados en la base de datos.
 */
app.get('/api/productos', async (req, res) => {
  try {
    const Product = require('./models/Product');
    
    // Busca todos los productos en la base de datos, excluyendo el _id interno de Mongo y __v si quieres que quede más limpio
    const productos = await Product.find({}, { _id: 0, __v: 0 });
    
    // Devuelve los productos en formato JSON
    res.json(productos);
  } catch (error) {
    console.error('❌ Error en /api/productos:', error.message);
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});
/**
 * GET /api/categorias
 * Devuelve un JSON con la lista de todas las categorías únicas disponibles.
 */
app.get('/api/categorias', async (req, res) => {
  try {
    const Product = require('./models/Product');
    
    // El método 'distinct' busca en toda la colección y devuelve un array solo con los valores únicos del campo 'category'
    const categorias = await Product.distinct('category');
    
    // Devuelve el array de categorías en formato JSON
    res.json(categorias);
  } catch (error) {
    console.error('❌ Error en /api/categorias:', error.message);
    res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
});

/**
 * GET /api/categorias/:nombreCategoria
 * Devuelve un JSON con los productos que pertenecen a una categoría específica.
 */
app.get('/api/categorias/:nombreCategoria', async (req, res) => {
  try {
    const Product = require('./models/Product');
    
    // Extraemos el nombre de la categoría de la URL
    const categoriaBuscada = req.params.nombreCategoria;
    
    // Buscamos en MongoDB solo los productos que coincidan con esa categoría
    const productos = await Product.find({ category: categoriaBuscada }, { _id: 0, __v: 0 });
    
    // Si no hay productos en esa categoría, devolvemos un 404
    if (productos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para esta categoría.' });
    }

    res.json(productos);
  } catch (error) {
    console.error('❌ Error en /api/categorias/:nombreCategoria:', error.message);
    res.status(500).json({ error: 'Error al buscar los productos de la categoría.' });
  }
});

/*  Arranque del servidor  */

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
