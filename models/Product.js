/**
 * @fileoverview Modelo Mongoose para Producto.
 * Basado en el esquema de la Fake Store API (https://fakestoreapi.com).
 * @module models/Product
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} ProductSchema
 * @property {Number} id          - Identificador único del producto (proveniente de la API externa).
 * @property {String} title       - Nombre / título del producto.
 * @property {Number} price       - Precio del producto en USD.
 * @property {String} category    - Categoría a la que pertenece el producto.
 */
const productSchema = new mongoose.Schema(
  {
    /** Identificador numérico único (de la Fake Store API). */
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    /** Título descriptivo del producto. */
    title: {
      type: String,
      required: true,
    },
    /** Precio del producto. */
    price: {
      type: Number,
      required: true,
    },
    /** Categoría del producto. */
    category: {
      type: String,
      required: true,
    },
  },
  {
    /** Añade campos createdAt y updatedAt automáticamente. */
    timestamps: true,
  }
);

/**
 * Modelo Mongoose de Producto.
 * @type {mongoose.Model}
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
