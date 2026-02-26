/**
 * @fileoverview Ruta de sincronización con la Fake Store API.
 * Consume la API externa y persiste los productos en MongoDB (CA3, CA4).
 * @module routes/sync
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../models/Product');

/**
 * GET /sync
 * Obtiene todos los productos de la Fake Store API y los guarda/actualiza
 * en la base de datos local usando upsert.
 *
 * @name GetSync
 * @route {GET} /sync
 * @returns {Object} 200 - Mensaje de éxito con el número de productos sincronizados.
 * @returns {Object} 500 - Mensaje de error si falla la sincronización.
 */
router.get('/sync', async (req, res) => {
  try {
    // 1. Consumir la API externa
    const { data } = await axios.get('https://fakestoreapi.com/products');

    // 2. Iterar y guardar/actualizar cada producto con upsert
    let count = 0;
    for (const item of data) {
      await Product.findOneAndUpdate(
        { id: item.id },
        {
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
        },
        { upsert: true, new: true }
      );
      count++;
    }

    res.json({
      message: `✅ Sincronización completada: ${count} productos guardados/actualizados.`,
    });
  } catch (error) {
    console.error('❌ Error en /sync:', error.message);
    res.status(500).json({ error: 'Error al sincronizar productos desde la API externa.' });
  }
});

module.exports = router;
