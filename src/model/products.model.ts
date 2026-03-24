import mongoose from 'mongoose';
import { IProduct } from '../types/products.types.js';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    measure: {
      type: String,
      required: true,
      trim: true,
    },
    medidaId: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      trim: true,
    },
    tipoProdutoId: {
      type: String,
      required: true,
    },
    embalagemId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

// Índices para performance
ProductSchema.index({ productType: 1 });
ProductSchema.index({ medidaId: 1 });
ProductSchema.index({ tipoProdutoId: 1 });
ProductSchema.index({ embalagemId: 1 });

const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;
