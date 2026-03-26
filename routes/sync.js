/**
 * @fileoverview Ruta de sincronización con la Fake Store API.
 * Consume la API externa y persiste los productos en MongoDB (CA3, CA4).
 * @module routes/sync
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../data/store');

router.get('/sync', async (req, res) => {
  try {
    // 1. Consumir la API externa
    const { data } = await axios.get('https://fakestoreapi.com/products');

    store.products = data;
    
    res.json({
      message: `Sincronización Comletada: ${store.products.length} productos guardados en memoria`
    });
  } catch (error) {
    console.error('Error en /sync,', error.message);
    res.status(500).json({ error: 'Error al sincronizar productos.'});
  }
});

module.exports = router;
