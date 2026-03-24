import { Schema, model } from 'mongoose';
import { ITiposDeGastos } from '../types/tiposDeGastos.types.js';

const tiposDeGastosSchema = new Schema<ITiposDeGastos>(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      unique: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
    },
    ativa: {
      type: Boolean,
      required: [true, 'Status é obrigatório'],
      default: true,
    },
  },
  { timestamps: true }
);

// Índices para otimização
tiposDeGastosSchema.index({ ativa: 1 });

export const TiposDeGastosModel = model<ITiposDeGastos>(
  'TiposDeGastos',
  tiposDeGastosSchema
);
