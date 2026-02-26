/**
 * @fileoverview Tests unitarios del endpoint /api/stats (CA8).
 * Se utiliza Jest como test runner y Supertest para peticiones HTTP.
 * @module tests/api.test
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');

/**
 * Suite de tests para el endpoint GET /api/stats.
 */
describe('GET /api/stats', () => {
  /**
   * Antes de todos los tests, conecta a una BD de test y siembra datos de ejemplo.
   */
  beforeAll(async () => {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ra9_dashboard_test';
    await mongoose.connect(MONGODB_URI);

    // Limpiar colección e insertar datos de prueba
    await Product.deleteMany({});
    await Product.insertMany([
      { id: 1, title: 'Producto A', price: 10, category: 'electronics' },
      { id: 2, title: 'Producto B', price: 20, category: 'electronics' },
      { id: 3, title: 'Producto C', price: 30, category: 'jewelery' },
    ]);
  });

  /**
   * Después de todos los tests, cierra la conexión a MongoDB.
   */
  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  it('debería responder con status 200', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toBe(200);
  });

  it('debería devolver un JSON válido con totalProducts, avgPrice y byCategory', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.headers['content-type']).toMatch(/json/);

    const body = res.body;
    expect(body).toHaveProperty('totalProducts');
    expect(body).toHaveProperty('avgPrice');
    expect(body).toHaveProperty('byCategory');
  });

  it('debería devolver el total correcto de productos', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.body.totalProducts).toBe(3);
  });

  it('debería agrupar correctamente los productos por categoría', async () => {
    const res = await request(app).get('/api/stats');
    const { byCategory } = res.body;

    expect(Array.isArray(byCategory)).toBe(true);
    expect(byCategory.length).toBe(2); // electronics y jewelery

    const electronics = byCategory.find((c) => c._id === 'electronics');
    expect(electronics).toBeDefined();
    expect(electronics.count).toBe(2);
  });
});
