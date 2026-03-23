import { Schema, model } from 'mongoose';
import { ITiposProduto } from '../types/tiposProduto.types';

const tiposProdutoSchema = new Schema<ITiposProduto>(
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
tiposProdutoSchema.index({ ativa: 1 });

export const TiposProdutoModel = model<ITiposProduto>(
  'TiposProduto',
  tiposProdutoSchema
);
