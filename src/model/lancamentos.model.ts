import mongoose, { Schema, Model } from 'mongoose';
import { ILancamento } from '../types/lancamentos.types.js';

// Schema do Lançamento
const lancamentoSchema = new Schema<ILancamento>(
  {
    produtoName: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true,
      minlength: [1, 'O nome do produto é obrigatório'],
    },
    quantity: {
      type: Number,
      required: [true, 'A quantidade é obrigatória'],
      min: [0.01, 'A quantidade deve ser maior que zero'],
    },
    value: {
      type: Number,
      required: [true, 'O valor é obrigatório'],
      min: [0.01, 'O valor deve ser maior que zero'],
    },
    ano: {
      type: Number,
      required: [true, 'O ano é obrigatório'],
      min: [1900, 'O ano deve estar entre 1900 e 2100'],
      max: [2100, 'O ano deve estar entre 1900 e 2100'],
    },
    mes: {
      type: Number,
      required: [true, 'O mês é obrigatório'],
      min: [1, 'O mês deve estar entre 1 e 12'],
      max: [12, 'O mês não pode ser maior que 12'],
    },
    embalagemId: {
      type: String,
      required: [true, 'O ID da embalagem é obrigatório'],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true,
    },
    mesNome: {
      type: String,
      required: [true, 'O nome do mês é obrigatório'],
      trim: true,
    },
    medidaId: {
      type: String,
      required: [true, 'O ID da medida é obrigatório'],
      trim: true,
    },
    tipoProdutoId: {
      type: String,
      required: [true, 'O ID do tipo de produto é obrigatório'],
      trim: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: '__v',
  }
);

// Índices para melhor performance em filtros
lancamentoSchema.index({ ano: 1 });
lancamentoSchema.index({ mes: 1 });
lancamentoSchema.index({ categoria: 1 });
lancamentoSchema.index({ embalagemId: 1 });
lancamentoSchema.index({ medidaId: 1 });
lancamentoSchema.index({ tipoProdutoId: 1 });
lancamentoSchema.index({ ano: 1, mes: 1 });
lancamentoSchema.index({ createdAt: 1 });
lancamentoSchema.index({ ano: 1, categoria: 1 });

// Criar e exportar o modelo
const LancamentoModel: Model<ILancamento> = mongoose.model<ILancamento>(
  'Lancamento',
  lancamentoSchema,
  'lancamentos'
);

export default LancamentoModel;
