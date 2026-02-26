/**
 * @fileoverview API REST propia – Inteligencia de Negocio.
 * Expone estadísticas calculadas mediante el pipeline de agregación de MongoDB (CA6, CA7).
 * @module routes/api
 */

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * GET /api/stats
 * Devuelve estadísticas agregadas de los productos almacenados:
 *  - totalProducts: número total de productos.
 *  - avgPrice:      precio medio global.
 *  - byCategory:    cantidad de productos agrupados por categoría.
 *
 * Utiliza $facet para ejecutar múltiples sub-pipelines en una sola consulta.
 *
 * @name GetApiStats
 * @route {GET} /api/stats
 * @returns {Object} 200 - JSON con las estadísticas.
 * @returns {Object} 500 - Error interno.
 */
router.get('/api/stats', async (req, res) => {
  try {
    const [result] = await Product.aggregate([
      {
        $facet: {
          /** 1) Total de productos */
          totalProducts: [{ $count: 'count' }],

          /** 2) Precio medio global */
          avgPrice: [
            {
              $group: {
                _id: null,
                avg: { $avg: '$price' },
              },
            },
          ],

          /** 3) Productos por categoría */
          byCategory: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    // Formatear la respuesta para facilitar su consumo en el frontend
    const stats = {
      totalProducts: result.totalProducts[0]?.count || 0,
      avgPrice: parseFloat((result.avgPrice[0]?.avg || 0).toFixed(2)),
      byCategory: result.byCategory, // [{ _id: 'electronics', count: 6 }, ...]
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ Error en /api/stats:', error.message);
    res.status(500).json({ error: 'Error al obtener estadísticas.' });
  }
});

module.exports = router;
