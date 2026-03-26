const express = require('express');
const router = express.Router();
const store = require('../data/store'); // Importamos la memoria

router.get('/api/stats', (req, res) => {
  try {
    const productos = store.products;

    // 1) Total de productos
    const totalProducts = productos.length;

    // 2) Precio medio global usando .reduce()
    const sumaTotal = productos.reduce((acc, prod) => acc + prod.price, 0);
    const avgPrice = totalProducts > 0 ? parseFloat((sumaTotal / totalProducts).toFixed(2)) : 0;

    // 3) Productos por categoría usando lógica manual
    const conteoCategorias = {};
    
    productos.forEach(prod => {
      if (conteoCategorias[prod.category]) {
        conteoCategorias[prod.category]++;
      } else {
        conteoCategorias[prod.category] = 1;
      }
    });

    // Convertir el objeto a un array y ordenarlo
    const byCategory = Object.keys(conteoCategorias).map(categoria => ({
      _id: categoria,
      count: conteoCategorias[categoria]
    })).sort((a, b) => b.count - a.count);

    // Enviar respuesta
    res.json({
      totalProducts,
      avgPrice,
      byCategory
    });
  } catch (error) {
    console.error('❌ Error en /api/stats:', error.message);
    res.status(500).json({ error: 'Error al calcular estadísticas.' });
  }
});

module.exports = router;